document.addEventListener('DOMContentLoaded', () => {
    // Existing Testimonial Carousel Script
    const testimonialCarouselContainer = document.querySelector('.testimonial-carousel-container');
    const testimonialCarouselSlides = document.querySelectorAll('.testimonial-carousel-slide');
    let testimonialCurrentIndex = 0;

    function showTestimonialSlide(index) {
        if (testimonialCarouselSlides.length === 0) return;
        testimonialCarouselSlides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextTestimonialSlide() {
        testimonialCurrentIndex = (testimonialCurrentIndex + 1) % testimonialCarouselSlides.length;
        showTestimonialSlide(testimonialCurrentIndex);
    }

    function prevTestimonialSlide() {
        testimonialCurrentIndex = (testimonialCurrentIndex - 1 + testimonialCarouselSlides.length) % testimonialCarouselSlides.length;
        showTestimonialSlide(testimonialCurrentIndex);
    }

    if (testimonialCarouselSlides.length > 0) {
        showTestimonialSlide(testimonialCurrentIndex); // Show the first testimonial slide

        const prevButton = document.querySelector('.testimonial-carousel-button.prev');
        const nextButton = document.querySelector('.testimonial-carousel-button.next');

        if (prevButton) prevButton.addEventListener('click', prevTestimonialSlide);
        if (nextButton) nextButton.addEventListener('click', nextTestimonialSlide);

        // Optional: Auto-advance testimonial carousel
        setInterval(nextTestimonialSlide, 7000); // Change testimonial every 7 seconds
    }


    // Nutrition Calculator Script
    const nutritionForm = document.getElementById('nutrition-calculator-form');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const activityLevelSelect = document.getElementById('activity-level');
    const goalSelect = document.getElementById('goal');
    const imcResult = document.getElementById('imc-result');
    const imcCategory = document.getElementById('imc-category');
    const tdeeResult = document.getElementById('tdee-result');
    const caloriesGoalResult = document.getElementById('calories-goal-result');
    const proteinResult = document.getElementById('protein-result');
    const fatResult = document.getElementById('fat-result');
    const carbResult = document.getElementById('carb-result');
    const clearResultsButton = document.getElementById('clear-results');

    // New elements for personalized plan recommendation
    const personalizedPlanRecommendation = document.getElementById('personalized-plan-recommendation');
    const recommendedTDEE = document.getElementById('recommended-tdee');
    const goalMaintain = document.getElementById('goal-maintain');
    const goalLose = document.getElementById('goal-lose');
    const goalGain = document.getElementById('goal-gain');


    if (nutritionForm) {
        nutritionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateFitness();
        });
    }

    if (clearResultsButton) {
        clearResultsButton.addEventListener('click', clearResults);
    }

    function calculateFitness() {
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value;
        const heightCm = parseFloat(heightInput.value);
        const weightKg = parseFloat(weightInput.value);
        const activityLevel = parseFloat(activityLevelSelect.value);
        const goal = goalSelect.value;

        if (isNaN(age) || isNaN(heightCm) || isNaN(weightKg) || age <= 0 || heightCm <= 0 || weightKg <= 0) {
            alert('Por favor, introduce valores válidos para edad, altura y peso.');
            return;
        }

        // Calculate IMC
        const heightM = heightCm / 100;
        const imc = weightKg / (heightM * heightM);
        imcResult.textContent = imc.toFixed(2);
        imcCategory.textContent = getIMCCategory(imc);

        // Calculate BMR (Harris-Benedict Equation modificada)
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
        } else {
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }
        const tdee = bmr * activityLevel;
        tdeeResult.textContent = tdee.toFixed(0);

        let caloriesForGoal;
        // Adjust TDEE based on goal
        switch (goal) {
            case 'maintain':
                caloriesForGoal = tdee;
                break;
            case 'lose':
                caloriesForGoal = tdee - 500; // Moderate deficit for weight loss
                break;
            case 'gain':
                caloriesForGoal = tdee + 500; // Moderate surplus for weight gain
                break;
            default:
                caloriesForGoal = tdee; // Fallback
        }

        // Ensure calories don't go below a healthy minimum (e.g., 1200 for women, 1500 for men)
        if (gender === 'female' && caloriesForGoal < 1200) {
            caloriesForGoal = 1200;
        } else if (gender === 'male' && caloriesForGoal < 1500) {
            caloriesForGoal = 1500;
        }

        caloriesGoalResult.textContent = Math.round(caloriesForGoal);

        // Macronutrient distribution (example percentages)
        // Protein: 25% of calories (4 kcal/g)
        // Fat: 30% of calories (9 kcal/g)
        // Carbs: 45% of calories (4 kcal/g)

        const proteinCalories = caloriesForGoal * 0.25;
        const fatCalories = caloriesForGoal * 0.30;
        const carbCalories = caloriesForGoal * 0.45;

        const proteinGrams = Math.round(proteinCalories / 4);
        const fatGrams = Math.round(fatCalories / 9);
        const carbGrams = Math.round(carbCalories / 4);

        proteinResult.textContent = `${proteinGrams}g`;
        fatResult.textContent = `${fatGrams}g`;
        carbResult.textContent = `${carbGrams}g`;

        // Update personalized plan recommendation section
        if (personalizedPlanRecommendation) {
            recommendedTDEE.textContent = `${tdee.toFixed(0)} kcal/día`;
            goalMaintain.textContent = `${tdee.toFixed(0)}`;
            goalLose.textContent = `${Math.round(tdee - 500)}`; // Approx for deficit
            goalGain.textContent = `${Math.round(tdee + 500)}`; // Approx for surplus
            personalizedPlanRecommendation.style.display = 'block'; // Show the section
        }
    }

    function getIMCCategory(imc) {
        if (imc < 18.5) return 'Bajo peso';
        else if (imc >= 18.5 && imc < 24.9) return 'Peso normal';
        else if (imc >= 25 && imc < 29.9) return 'Sobrepeso';
        else if (imc >= 30 && imc < 34.9) return 'Obesidad Clase I';
        else if (imc >= 35 && imc < 39.9) return 'Obesidad Clase II';
        else return 'Obesidad Clase III';
    }

    function clearResults() {
        ageInput.value = '';
        heightInput.value = '';
        weightInput.value = '';
        genderSelect.value = 'male';
        activityLevelSelect.value = '1.2';
        goalSelect.value = 'maintain';

        imcResult.textContent = 'N/A';
        imcCategory.textContent = 'N/A';
        tdeeResult.textContent = 'N/A';
        caloriesGoalResult.textContent = 'N/A';
        proteinResult.textContent = 'N/A';
        fatResult.textContent = 'N/A';
        carbResult.textContent = 'N/A';

        // Hide personalized plan recommendation section on clear
        if (personalizedPlanRecommendation) {
            personalizedPlanRecommendation.style.display = 'none';
        }
    }
});