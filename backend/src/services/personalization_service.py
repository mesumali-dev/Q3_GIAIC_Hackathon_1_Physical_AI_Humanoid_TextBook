from typing import Dict, Any
from src.models.user import SoftwareLevel, HardwareBackground


class PersonalizationService:
    """
    Service for generating personalized content based on user background.
    """

    @staticmethod
    def generate_personalization_context(
        software_level: str,
        hardware_background: str
    ) -> Dict[str, Any]:
        """
        Generate personalization context based on user background.

        Args:
            software_level: User's software experience level
            hardware_background: User's hardware experience

        Returns:
            Dictionary containing personalization context
        """
        # Map software level to explanation style
        software_explanation_map = {
            SoftwareLevel.BEGINNER.value: "Provide simplified explanations with step-by-step guidance, analogies, and visual examples. Assume minimal technical knowledge.",
            SoftwareLevel.INTERMEDIATE.value: "Provide moderately detailed explanations with some technical depth. Include examples and best practices.",
            SoftwareLevel.ADVANCED.value: "Provide technical, concise explanations. Focus on implementation details, performance considerations, and advanced concepts."
        }

        # Map hardware background to example preferences
        hardware_example_map = {
            HardwareBackground.ROBOTICS.value: "Include relevant examples from robotics applications, sensor integration, motor control, and robotic systems.",
            HardwareBackground.EMBEDDED_SYSTEMS.value: "Include relevant examples from embedded systems, microcontrollers, real-time constraints, and hardware-software integration.",
            HardwareBackground.NONE.value: "Avoid hardware-specific examples. Focus on software and algorithmic concepts.",
            HardwareBackground.OTHER.value: "Provide general examples suitable for mixed hardware backgrounds."
        }

        # Get explanation style based on software level
        explanation_style = software_explanation_map.get(
            software_level,
            "Provide explanations suitable for mixed experience levels."
        )

        # Get example preference based on hardware background
        example_preference = hardware_example_map.get(
            hardware_background,
            "Provide general examples suitable for various backgrounds."
        )

        # Generate comprehensive personalization notes
        personalization_notes = f"{explanation_style} {example_preference}"

        return {
            "software_level": software_level,
            "hardware_background": hardware_background,
            "personalization_notes": personalization_notes,
            "response_style": explanation_style,
            "example_preference": example_preference
        }

    @staticmethod
    def adapt_response_for_user(
        original_response: str,
        software_level: str,
        hardware_background: str
    ) -> str:
        """
        Adapt a response based on user background.

        Args:
            original_response: The original response from the chatbot
            software_level: User's software experience level
            hardware_background: User's hardware experience

        Returns:
            Adapted response tailored to user background
        """
        # This is a simplified implementation
        # In a real application, this would involve more sophisticated adaptation
        # based on the user's background

        if software_level == SoftwareLevel.BEGINNER.value:
            # Add more explanations for beginners
            adapted_response = original_response
            # You could add more beginner-friendly explanations here
        elif software_level == SoftwareLevel.ADVANCED.value:
            # Add more technical depth for advanced users
            adapted_response = original_response
            # You could add more technical details here
        else:
            # For intermediate users, return as is
            adapted_response = original_response

        return adapted_response