import React, { useState } from 'react';
import './AppointmentPage.css';

const AppointmentForm = () => {
    const [formStatus, setFormStatus] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const isSuccess = true;

        if (isSuccess) {
            setFormStatus('success');
        } else {
            setFormStatus('error');
        }
    };

    if (formStatus === 'success') {
        return (
            <div className="appointment-container">
                <div className="success-message">
                    <h1>Appointment Booked Successfully!</h1>
                    <p>Thank you for booking an appointment with us. We will get back to you shortly.</p>
                </div>
            </div>
        );
    }

    if (formStatus === 'error') {
        return (
            <div className="appointment-container">
                <div className="error-message">
                    <h1>There was an error!</h1>
                    <p>It seems you are not submitting all the details as they are expected.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="appointment-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name*" required />
                    <input type="text" placeholder="Mobile No*" required />
                    <input type="email" placeholder="Email Id*" required />
                    <input type="date" placeholder="Select Date*" required />
                    <select required>
                        <option value="">Drs*</option>
                        <option value="general">A</option>
                        <option value="cardiology">B</option>
                        <option value="neurology">C</option>
                        <option value="pediatrics">D</option>
                    </select>
                    <select required>
                        <option value="">Diagnosing Category*</option>
                        <option value="general">General</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="neurology">Neurology</option>
                        <option value="pediatrics">Pediatrics</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="text-container">
                
            </div>
        </div>
    );
};

export default AppointmentForm;
