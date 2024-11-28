import React, { useState } from 'react';
import Modal from './Modal';
import AssessmentPurpose from './AssessmentPurpose';
import AssessmentDetails from './AssessmentDetails';
import ConfigureAssessment from './ConfigureAssessment';

function AssessmentModal({ isOpen, setIsOpen, assessment }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPurpose, setSelectedPurpose] = useState(null); // Initialize as null

  // Define the steps of the assessment process
  const steps = [
    // Step 1: AssessmentDetails
    <AssessmentDetails
      key="assessment-details"
      assessment={assessment}
      onNext={() => setCurrentStep(1)}  // Move to step 2
    />,

    // Step 2: AssessmentPurpose
    <AssessmentPurpose
      key="assessment-purpose"
      assessment={assessment}
      onSelectPurpose={(purpose) => {
        setSelectedPurpose(purpose);  // Set selected purpose here
        setCurrentStep(2);  // Move to step 3
      }}
    />,

    // Step 3: ConfigureAssessment
    <ConfigureAssessment
      key="configure-assessment"
      assessment={assessment}
      purpose={selectedPurpose}  // Pass selected purpose as a prop
      onBack={() => setCurrentStep(1)}  // Go back to step 2
      onSubmit={() => setIsOpen(false)}  // Close modal after submit
    />,
  ];

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {steps[currentStep]}  {/* Render the current step */}
    </Modal>
  );
}

export default AssessmentModal;
