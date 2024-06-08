const ocrResultsContainer = document.getElementById('ocr-results');
const ocrTextarea = document.getElementById('ocr-text');
const img = document.querySelector('img');
const progress = document.querySelector('.progress');
const enrollmentTableBody = document.querySelector('#enrollment-table tbody');


function uploadEnrollment() {
    const fileSelector = document.getElementById('enrollment-upload');

    if (fileSelector.files.length === 0) {
        alert('Please select an image file.');
        return;
    }

    const file = fileSelector.files[0];
    displayImage(file);

    performOCR(file);
}

function displayImage(file) {
    const imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }));
    img.src = imgUrl;
}

function performOCR(file) {
    ocrTextarea.innerHTML = '';
    const rec = new Tesseract.TesseractWorker();
    rec.recognize(file)
        .progress(function (response) {
            if (response.status === 'recognizing text') {
                progress.innerHTML = response.status + '   ' + response.progress;
            } else {
                progress.innerHTML = response.status;
            }
        })
        .then(function (data) {
        
            ocrTextarea.value = data.text;
            ocrResultsContainer.style.display = 'block';



            
            const yearRegex = /\b(20\d{2})\b/;
            const sessionRegex = /DXB UG (Winter|Autumn|Spring) @ (\w+\/ On Campus)\b/;
            const subjectCodeRegex = /\b([A-Z]{4}\d{3})\b/;
            const regex = /Major:\s*([^\n]+)/;

         
            const lines = data.text.split('\n');

            console.log("Lines: ",lines);
           
            const yearArray = [];
            const sessionArray = [];
            const campusDeliveryArray = [];
            const subjectCodeArray = [];


           
            const match = regex.exec(lines.join('\n'));
            const major = match ? match[1].trim() : null;



            
            lines.forEach(line => {
                
                const yearMatch = line.match(yearRegex);
                const sessionMatch = line.match(sessionRegex);
                const subjectCodeMatch = line.match(subjectCodeRegex);

                
                if (yearMatch) {
                    yearArray.push(yearMatch[1]);
                }

                if (sessionMatch) {
                    sessionArray.push(sessionMatch[1]);
                    campusDeliveryArray.push(sessionMatch[2]);
                }

                if (subjectCodeMatch) {
                    subjectCodeArray.push(subjectCodeMatch[1]);
                }
            });


           
            console.log('Year Array:', yearArray);
            console.log('Session Array:', sessionArray);
            console.log('Campus/Delivery Array:', campusDeliveryArray);
            console.log('Subject Code Array:', subjectCodeArray);
            console.log("Major:", major);



            const table = document.getElementById('extracted-values-table');
            const tbody = table.getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; 

         
            const maxRows = Math.max(yearArray.length, sessionArray.length, campusDeliveryArray.length, subjectCodeArray.length);

            
            for (let i = 0; i < maxRows; i++) {
                
                const newRow = tbody.insertRow();

           
                const yearCell = newRow.insertCell(0);
                const sessionCell = newRow.insertCell(1);
                const campusDeliveryCell = newRow.insertCell(2);
                const subjectCodeCell = newRow.insertCell(3);

               
                yearCell.contentEditable = true;
                sessionCell.contentEditable = true;
                campusDeliveryCell.contentEditable = true;
                subjectCodeCell.contentEditable = true;

               
                yearCell.textContent = yearArray[i] || ''; 
                sessionCell.textContent = sessionArray[i] || '';
                campusDeliveryCell.textContent = campusDeliveryArray[i] || '';
                subjectCodeCell.textContent = subjectCodeArray[i] || '';

                
            }

            
            table.style.display = 'block';
            updateArraysFromTable();
            
    });

    
}




function updateArraysFromTable() {
    const table = document.getElementById('extracted-values-table');
    const tbody = table.getElementsByTagName('tbody')[0];

    const updatedYearArray = [];
    const updatedSessionArray = [];
    const updatedCampusDeliveryArray = [];
    const updatedSubjectCodeArray = [];

    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];

        const updatedYear = row.cells[0].textContent.trim();
        const updatedSession = row.cells[1].textContent.trim();
        const updatedCampusDelivery = row.cells[2].textContent.trim();
        const updatedSubjectCode = row.cells[3].textContent.trim();

        updatedYearArray.push(updatedYear);
        updatedSessionArray.push(updatedSession);
        updatedCampusDeliveryArray.push(updatedCampusDelivery);
        updatedSubjectCodeArray.push(updatedSubjectCode);
    }

    yearArray = updatedYearArray;
    sessionArray = updatedSessionArray;
    campusDeliveryArray = updatedCampusDeliveryArray;
    subjectCodeArray = updatedSubjectCodeArray;

    
    console.log('Updated Year Array:', yearArray);
    console.log('Updated Session Array:', sessionArray);
    console.log('Updated Campus/Delivery Array:', campusDeliveryArray);
    console.log('Updated Subject Code Array:', subjectCodeArray);


    populateTable();
    submitOCRResults();


    
}


document.getElementById('extracted-values-table').addEventListener('input', function () {
    updateArraysFromTable();
});




function validateAndNext() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const universityName = document.getElementById('university-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('password').value;

    const nameRegex = /^[A-Za-z]+$/; 
    const universityNameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const studentIdRegex = /^\d{7}$/; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const firstNameError = validateInput(firstName, nameRegex, 'first-name', 'first-name-error', 'Invalid first name');
    const lastNameError = validateInput(lastName, nameRegex, 'last-name', 'last-name-error', 'Invalid last name');
    const universityNameError = validateInput(universityName, universityNameRegex, 'university-name', 'university-name-error', 'Invalid university name');
    const phoneError = validateInput(phone, phoneRegex, 'phone', 'phone-error', 'Invalid phone number');
    const emailError = validateInput(email, emailRegex, 'email', 'email-error', 'Invalid email address');
    const studentIdError = validateInput(studentId, studentIdRegex, 'student-id', 'student-id-error', 'Invalid student ID');
    const passwordError = validateInput(password, passwordRegex, 'password', 'password-error', 'Invalid password');

    if (firstNameError || lastNameError || universityNameError || phoneError || emailError || studentIdError || passwordError) {
        return; 
    }

    const userData = {
        firstName: firstName,
        lastName: lastName,
        universityName: universityName,
        studentId: studentId,
        phone: phone,
        email: email,
        password: password
    };

    console.log('Stored user data:', userData);

        fetch('/submitUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('User data saved successfully');
                document.getElementById('user-info-modal').style.display = 'none';
                document.getElementById('enrollment-upload-modal').style.display = 'block';
            } else {
                console.error('Error saving user data:', data.message);
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = data.message;
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
        
}



function validateInput(value, regex, inputId, errorId, errorMessage) {
    const errorElement = document.getElementById(errorId);
    if (!regex.test(value)) {
        errorElement.textContent = errorMessage;
        document.getElementById(inputId).classList.add('error');
        return true; 
    } else {
        errorElement.textContent = '';
        document.getElementById(inputId).classList.remove('error');
        return false; 
        
    }
}


function populateTable() {
    const table = document.getElementById('project-table');
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; 

    
    for (let i = 0; i < subjectCodeArray.length; i++) {
        
        const newRow = tbody.insertRow();

        const subjectCodeCell = newRow.insertCell(0);
        const hasProjectCell = newRow.insertCell(1);
        const projectUploadCell = newRow.insertCell(2);

       
        subjectCodeCell.innerHTML = `<input type="text" class="subject-code" value="${subjectCodeArray[i]}" data-row-id="${i}" readonly>`;
        hasProjectCell.innerHTML = `<select data-row-id="${i}"><option value="Yes">Yes</option><option value="No">No</option></select>`;
        projectUploadCell.innerHTML = `<input type="file" class="project-upload" data-row-id="${i}">`;

        console.log('Table is being populated');
    }

    
    table.style.display = 'block';
}

function next() {
    document.getElementById('project-upload').style.display = 'none';
    document.getElementById('certifications-modal').style.display = 'block';


        fetch('/saveProjectData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({subjectCodeArray, }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Subject data saved successfully');
            } else {
                console.error('Error saving subject data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    

}


function showOCRResults(text) {
    document.getElementById('ocr-text').value = text;
    document.getElementById('ocr-results').style.display = 'block';
}

function showEnrollmentUpload() {
    document.getElementById('terms-modal').style.display = 'none';
    document.getElementById('user-info-modal').style.display = 'block';
}

function closeTermsModal() {
    document.getElementById('terms-modal').style.display = 'none';
}

function showUserInfo() {
    document.getElementById('ocr-results').style.display = 'none';
    document.getElementById('enrollment-upload-modal').style.display = 'none';
    document.getElementById('extracted-values-table').style.display = 'none';
    document.getElementById('project-modal').style.display = 'block';

    fetch('/saveSubjectData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yearArray, sessionArray, campusDeliveryArray, subjectCodeArray }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Subject data saved successfully');
            } else {
                console.error('Error saving subject data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function showProjectUpload() {
    document.getElementById('user-info-modal').style.display = 'none';
    document.getElementById('project-upload').style.display = 'block';
}



function extract() {
    document.getElementById('extracted-values-table').style.display = 'block';

}

function confirmExtractedInformation() {
     document.getElementById('user-info-modal').style.display = 'block';
}


function next() {
   
    document.getElementById('user-info-modal').style.display = 'none';
}



    
function handleCertifications() {
    const hasCertifications = document.getElementById('has-certifications').value;
    if (hasCertifications === 'yes') {
    
        document.getElementById('certifications-modal').style.display = 'block';
    } else {
        
        handleNextAfterCertifications();
    }
}

function handleNextAfterCertifications() {
    
    document.getElementById('certifications-modal').style.display = 'none';
    
}



document.addEventListener('paste', function (event) {
 
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;

  
    if (items.length > 0 && items[0].type.indexOf('image') !== -1) {
        const file = items[0].getAsFile();
        displayImage(file);
        performOCR(file);
    }
});



const fileSelector = document.querySelector('#enrollment-upload');
const start = document.querySelector('#upload-btn');
const img1 = document.querySelector('#uploaded-img');
const progress1 = document.querySelector('.progress');
const textarea = document.querySelector('#ocr-text');


fileSelector.onchange = () => {
    var file = fileSelector.files[0];
    var imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }));
    img.src = imgUrl;
}


start.onclick = () => {
    textarea.innerHTML = '';
    const rec = new Tesseract.TesseractWorker();
    rec.recognize(fileSelector.files[0])
        .progress(function (response) {
            if (response.status == 'recognizing text') {
                progress.innerHTML = response.status + '   ' + response.progress;
            } else {
                progress.innerHTML = response.status;
            }
        })
        .then(function (data) {
            textarea.innerHTML = data.text;
            progress.innerHTML = 'Done';
          
            showOCRResults(data.text);
        })
}


function showOCRResults(text) {
    document.getElementById('ocr-text').value = text;
    document.getElementById('ocr-results').style.display = 'block';
}


function submitOCRResults() {
  
    const ocrResults = document.getElementById('ocr-text').value;
    const updatedArrays = {
        yearArray: yearArray,
        sessionArray: sessionArray,
        campusDeliveryArray: campusDeliveryArray,
        subjectCodeArray: subjectCodeArray
        
    };

    const ocrData = {
        ocrResults: ocrResults,
        updatedArrays: updatedArrays
    };

    fetch('/submitOCRResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ocrData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('OCR results and arrays submitted successfully');
         
        } else {
            console.error('Failed to submit OCR results and arrays');
        }
    })
    .catch(error => {
        console.error('Error submitting OCR results and arrays:', error);
    });
}