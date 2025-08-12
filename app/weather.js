const headerelement = document.getElementById('dynamicHeader');
const currentTime = new Date();
const currentHour = currentTime.getHours();

let headerContent;
if (currentHour < 12) {
    headerCountent = 'Good Morning!';
} else if (currentHour < 18) {
    headerContent = 'Good Afternoon!';
} else {
    headerContent = 'Good Evening!';
}

headerelement.innerHTML = headerContent;

const dateElement = document.getElementById('dynamic-date');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateElement.innerHTML = currentTime.toLocaleDateString(undefined, options);     