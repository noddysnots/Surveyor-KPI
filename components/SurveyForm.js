   import { useState, useEffect } from 'react';
   import styles from '../styles/SurveyForm.module.css';

   const SurveyForm = () => {
     const [surveyorName, setSurveyorName] = useState('');
     const [surveyorId, setSurveyorId] = useState('');
     const [date, setDate] = useState('');
     const [farmerName, setFarmerName] = useState('');
     const [farmId, setFarmId] = useState('');
     const [latitude, setLatitude] = useState('');
     const [longitude, setLongitude] = useState('');
     const [error, setError] = useState('');
     const [successMessage, setSuccessMessage] = useState('');
     const [isSubmitting, setIsSubmitting] = useState(false);

     const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwKKxwG0YLVz_5dFHcff7RyQZKyy62GOSNpJqBDuEvaQK1VdynUnj2JbYUs_Z7Im4v/exec';

     useEffect(() => {
       const today = new Date();
       const formattedDate = today.toISOString().split('T')[0];
       setDate(formattedDate);
     }, []);

     const handleGetLocation = () => {
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
           (position) => {
             setLatitude(position.coords.latitude.toFixed(6));
             setLongitude(position.coords.longitude.toFixed(6));
             setError('');
           },
           (err) => {
             setError(`Error getting location: ${err.message}`);
           }
         );
       } else {
         setError('Geolocation is not supported by this browser.');
       }
     };

     const clearForm = () => {
       setSurveyorName('');
       setSurveyorId('');
       const today = new Date();
       const formattedDate = today.toISOString().split('T')[0];
       setDate(formattedDate);
       setFarmerName('');
       setFarmId('');
       setLatitude('');
       setLongitude('');
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');
       setSuccessMessage('');

       if (!surveyorName || !surveyorId || !date || !farmerName || !farmId || !latitude || !longitude) {
         setError('All fields, including location, are required.');
         return;
       }

       setIsSubmitting(true);

       const formData = {
         surveyorName,
         surveyorId,
         date,
         farmerName,
         farmId,
         latitude,
         longitude,
       };

       try {
         const response = await fetch(GOOGLE_SCRIPT_URL, {
           method: 'POST',
           mode: 'cors',
           headers: {
             // 'Content-Type': 'application/json', // Not strictly needed for Apps Script
           },
           body: JSON.stringify(formData),
         });

         const responseText = await response.text();
         let result;
         try {
           result = JSON.parse(responseText);
         } catch (parseError) {
           console.error("Raw response from Apps Script (not JSON):", responseText);
           if (responseText.toLowerCase().includes("<html") || responseText.toLowerCase().includes("<!doctype html")) {
               setError("Submission failed. The server returned an HTML error page. Check Apps Script logs.");
           } else {
               setError('Received an unexpected response from the server. Check console and Apps Script logs.');
           }
           console.error('Parse error details:', parseError);
           setIsSubmitting(false);
           return;
         }

         if (result.status === 'success') {
           setSuccessMessage(result.message || 'Data submitted successfully!');
           clearForm();
           setTimeout(() => setSuccessMessage(''), 4000);
         } else {
           setError(result.message || 'Failed to submit data to Google Sheet. Check Apps Script logs.');
         }

       } catch (apiError) {
         console.error('Submission fetch error details:', apiError);
         setError(`Submission failed: ${apiError.message}. Check network connection and Apps Script deployment.`);
       } finally {
         setIsSubmitting(false);
       }
     };

     return (
       <div className={styles.container}>
         <form onSubmit={handleSubmit} className={styles.form}>
           <h1>Varaha Surveyor</h1>
           {error && <p className={styles.error}>{error}</p>}
           {successMessage && <p className={styles.success}>{successMessage}</p>}

           <div className={styles.formGroup}>
             <label htmlFor="surveyorName">Surveyor Name *</label>
             <input
               type="text"
               id="surveyorName"
               value={surveyorName}
               onChange={(e) => setSurveyorName(e.target.value)}
               required
               disabled={isSubmitting}
             />
           </div>

           <div className={styles.formGroup}>
             <label htmlFor="surveyorId">Surveyor ID *</label>
             <input
               type="text"
               id="surveyorId"
               value={surveyorId}
               onChange={(e) => setSurveyorId(e.target.value)}
               required
               disabled={isSubmitting}
             />
           </div>

           <div className={styles.formGroup}>
             <label htmlFor="date">Date *</label>
             <input
               type="date"
               id="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               required
               disabled={isSubmitting}
             />
           </div>

           <div className={styles.formGroup}>
             <label htmlFor="farmerName">Farmer Name *</label>
             <input
               type="text"
               id="farmerName"
               value={farmerName}
               onChange={(e) => setFarmerName(e.target.value)}
               required
               disabled={isSubmitting}
             />
           </div>

           <div className={styles.formGroup}>
             <label htmlFor="farmId">Farm ID *</label>
             <input
               type="text"
               id="farmId"
               value={farmId}
               onChange={(e) => setFarmId(e.target.value)}
               required
               disabled={isSubmitting}
             />
           </div>

           <div className={styles.locationSection}>
             <div className={styles.locationHeader}>Location Details</div>
             <div className={styles.locationContainer}>
               <button type="button" onClick={handleGetLocation} className={styles.locationButton} disabled={isSubmitting}>
                   Get Location
               </button>
               <div className={styles.coordinatesGroup}>
                   <div className={styles.formGroupInline}>
                       <label htmlFor="latitude">Latitude *</label>
                       <input
                           type="text"
                           id="latitude"
                           value={latitude}
                           readOnly
                           placeholder="Latitude"
                           disabled={isSubmitting} // Already readOnly, but good for consistency
                       />
                   </div>
                   <div className={styles.formGroupInline}>
                       <label htmlFor="longitude">Longitude *</label>
                       <input
                           type="text"
                           id="longitude"
                           value={longitude}
                           readOnly
                           placeholder="Longitude"
                           disabled={isSubmitting}
                       />
                   </div>
               </div>
             </div>
           </div>

           <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
             {isSubmitting ? 'Submitting...' : 'Submit Data'}
           </button>
         </form>
       </div>
     );
   };

   export default SurveyForm;