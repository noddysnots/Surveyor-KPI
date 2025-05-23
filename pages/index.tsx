   import Head from 'next/head';
   import SurveyForm from '../components/SurveyForm'; // Next.js will resolve .js or .tsx
   import styles from '../styles/Home.module.css';
   import React from 'react'; // Good practice in TSX files

   const HomePage: React.FC = () => {
     return (
       <>
         <Head>
           <title>Varaha Surveyor - Farm Survey</title> {/* Updated title to reflect branding */}
           <meta name="description" content="Farm onboarding survey for Varaha Surveyor project" />
           <meta name="viewport" content="width=device-width, initial-scale=1" />
           <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className={styles.main}>
           <SurveyForm />
         </main>
       </>
     );
   }

   export default HomePage;