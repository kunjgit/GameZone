alert("Please Enter Your Date Of Birth.");
const yearField = document.getElementById('year');
const monthField = document.getElementById('month');
const dayField = document.getElementById('day');
const calculateButton = document.getElementById('calculate-age');
const display = document.getElementById('display');
const today = new Date();
let selectedYear = today.getFullYear(),
	selectedMonth = today.getMonth() + 1,
	selectedDay = today.getDate(),
	daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
window.addEventListener('DOMContentLoaded', () => {
	updateDaysOfMonths(today.getFullYear());
	fillYearField();
	updateDayField(today.getFullYear(), today.getMonth() + 1);
	selectMonth(today.getMonth() + 1);
	selectDay(today.getDate());

	yearField.addEventListener('change', handleYearChange);
	monthField.addEventListener('change', handleMonthChange);
	dayField.addEventListener('change', handleDayChange);
	calculateButton.addEventListener('click', handleAgeCalculation);
});
function isLeapYear(year) {
	if (year % 400 === 0) return true;
	if (year % 100 === 0) return false;
	if (year % 4 === 0) return true;
	return false;
}
function updateDaysOfMonths(year) {
	daysOfMonths[1] = isLeapYear(year) ? 29 : 28;
}
function selectMonth(month) {
	monthField.value = month;
}
function selectDay(day) {
	dayField.value = day;
}
function fillYearField() {
	const numberOfYears = 100;
	const currentYear = today.getFullYear();
	const startYear = currentYear - numberOfYears;

	for (let i = startYear; i <= currentYear; i++) {
		const option = document.createElement('option');
		option.value = i;
		option.textContent = i;

		i === currentYear && option.setAttribute('selected', 'selected');
		yearField.appendChild(option);
	}
}
function updateDayField(year, month) {
	updateDaysOfMonths(year);
	const totalDays = daysOfMonths[month - 1];
	clearList(dayField);
	console.log({ selectedDay });

	for (let i = 1; i <= totalDays; i++) {
		const option = document.createElement('option');
		option.value = i;
		option.textContent = i;

		if (i === selectedDay) option.setAttribute('selected', 'selected');
		dayField.appendChild(option);
	}
}
function clearList(element) {
	for (let i = element.options.length - 1; i >= 1; i--) {
		element.remove(i);
	}
}
function makeDate() {
	return new Date(selectedYear, selectedMonth - 1, selectedDay);
}
function handleYearChange(event) {
	event.preventDefault();
	const { value } = event.target;
	selectedYear = +value;
	updateDayField(value, selectedMonth);
}
const months = [31,28,31,30,31,30,31,31,30,31,30,31];
function ageCalculate(){
    let today = new Date();
    let inputDate = new Date(document.getElementById("date-input").value);
    let birthMonth,birthDate,birthYear;
    let birthDetails = {
        date:inputDate.getDate(),
        month:inputDate.getMonth()+1,
        year:inputDate.getFullYear()
    }
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth()+1;
    let currentDate = today.getDate();

    leapChecker(currentYear);

    if(
        birthDetails.year > currentYear ||
        ( birthDetails.month > currentMonth && birthDetails.year == currentYear) || 
        (birthDetails.date > currentDate && birthDetails.month == currentMonth && birthDetails.year == currentYear)
    ){
        alert("Please Enter a Valid Date Of Birth.");
        displayResult("-","-","-");
        return;
    }

    birthYear = currentYear - birthDetails.year;

    if(currentMonth >= birthDetails.month){
        birthMonth = currentMonth - birthDetails.month;
    }
    else{
        birthYear--;
        birthMonth = 12 + currentMonth - birthDetails.month;
    }

    if(currentDate >= birthDetails.date){
        birthDate = currentDate - birthDetails.date;
    }
    else{
        birthMonth--;
        let days = months[currentMonth - 2];
        birthDate = days + currentDate - birthDetails.date;
        if(birthMonth < 0){
            birthMonth = 11;
            birthYear--;
        }
    }
    displayResult(birthDate,birthMonth,birthYear);
}

function displayResult(bDate,bMonth,bYear){
    document.getElementById("years").textContent = bYear;
    document.getElementById("months").textContent = bMonth;
    document.getElementById("days").textContent = bDate;
}

function leapChecker(year){
    if(year % 4 == 0 || (year % 100 == 0 && year % 400 == 0)){
        months[1] = 29;
    }
    else{
        months[1] = 28;
    }
}