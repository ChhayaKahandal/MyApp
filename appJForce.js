import { LightningElement ,track,wire} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getActiveAppointmentSlots from '@salesforce/apex/AppJfCon.getActiveAppointmentSlots';
//c/accountsRelatedNews
import checkDuplicateAppointment  from '@salesforce/apex/AppJfCon.checkDuplicateAppointment';


export default class AppJForce extends LightningElement {
    
    @track name;
    @track contact;
    @track subject;
    @track appointmentDate;
    @track appointmentTime;
    @track description;
    @track resultMessage;



    appointmentSlots;
    @wire(getActiveAppointmentSlots)
    wiredAppointmentSlots({ error, data }) {
        if (data) {
            this.appointmentSlots = data;
            // Optionally, you can process or format the appointmentSlots data here
        } else if (error) {
            console.error('Error fetching appointment slots:', error);
        }
        //using this we map that form value into the variable
    }


    handleNameChange(event) {
        this.name= event.target.value;
    }

    handleContactChange(event) {
        this.contact = event.target.value;
    }

    handleSubjectChange(event) {
        this.subject = event.target.value;
    }

    handleDateChange(event) {
        this.appointmentDate = event.target.value;
    }
    handleTimeChange(event) {
        this.appointmentTime = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }



     //
     













   handleCheckDuplicate() {
        // Ensure both date and time are provided
        if (!this.appointmentDate || !this.appointmentTime) {
            this.resultMessage = 'Please provide both date and time.';
            return;
        }

        // Call the Apex method imperatively
        checkDuplicateAppointment({ 
            appointmentDate: this.appointmentDate,
            appointmentTime: this.appointmentTime
        })
        .then(result => {
            // Handle the result from Apex
            if (result) {
                this.resultMessage = 'Appointments exist for the selected date and time.';
            } else {
                this.resultMessage = 'No appointments found for the selected date and time.';
            }
        })
        .catch(error => {
            // Handle any errors
            console.error('Error fetching appointments:', error);
            this.resultMessage = 'Error fetching appointments. Please try again.';
        });

}

















    handleSave() {
        // Prepare fields to create a new record
        const fields = {
            'Name':this.name,
            'Contact__c': this.contact,
            'Subject__c': this.subject,
            'Appointment_Date__c': this.appointmentDate,
            'Appointment_Time__c': this.appointmentTime,
            'Description__c':this.description

        };

        // Create a new record using LDS UI API
        createRecord({ apiName: 'AppointmentDetail__c', fields })
            .then(result => {
                // Clear the form and show success message
                this.name= '';
                this.contact = '';
                this.subject = '';
                this.appointmentDate = '';
                this.appointmentTime= '';
                this.description = '';
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Appointment created successfully',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                // Handle error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });


        }

            //






            

            
}






