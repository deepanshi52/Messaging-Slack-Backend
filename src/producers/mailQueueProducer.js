import '../processors/mailProcessor.js';

import mailQueue from '../queues/mailQueue.js';
export const addEmailtoMailQueue = async (emailData) => {
    console.log('Initiating email sending process'); 
     try {
        await mailQueue.add(emailData);
     } catch (error) {
        console.log('Add email to mail queue error', error);    
    }
};