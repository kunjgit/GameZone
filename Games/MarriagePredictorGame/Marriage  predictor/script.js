function predictMarriage() {
    var name = document.getElementById("name").value;
    var age = parseInt(document.getElementById("age").value);
    var gender = document.getElementById("gender").value;

    // Basic validation
    if (!name || !age) {
        alert("Please fill out all fields.");
        return;
    }

    // Marriage prediction based on age and gender
    var prediction;
    var imageUrl;

    if (age < 25) {
        prediction = "You are too young to think about marriage.";
        imageUrl = "images/too_young.jpg";
    } else if (age >= 25 && age <= 30) {
        prediction = "Marriage might be in your near future!";
        imageUrl = "images/might_marry.jpg";
    } else if (age > 30 && age <= 40) {
        prediction = "You have a good chance of getting married soon!";
        imageUrl = "images/good_chance.jpg";
    } else {
        prediction = "You will find your soulmate when the time is right.";
        imageUrl = "images/soulmate.jpg";
    }

    document.getElementById("prediction").innerText = `${name}, ${prediction}`;
    document.getElementById("prediction-image").src = imageUrl;
}
document.addEventListener('DOMContentLoaded', function () {
    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
    });
});