const myModule = require('./myModule');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
//const mySess = require('./mysession');
const util = require('util');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const port = 8080;
const gemini = myModule.model;
app.use('/external', express.static('external'));

app.set('views', path.join(__dirname));
app.set('view engine', 'html')



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ShnayZoop11!',
    database: 'proj_321'
});

app.use(session({
    secret: 'your-', 
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        password: 'ShnayZoop11!',
        database: 'proj_321',
    }),
    cookie: {
        maxAge: 3600000, 
    },
}));



db.connect(err => {
    if (err) {
        console.error('Unable to connect to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = myModule.connectToDB();


app.use(express.static(path.join(__dirname), { 'extensions': ['html'], 'index': false, 'setHeaders': res => res.type('text/html') }));


app.use(express.static('public')); 


app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'homepageNew.html'));
});

app.get('/create_profile.html', (req, res) => {
    res.sendFile(path.join(__dirname,'create_profile.html'));
});


app.get('/logout', (req, res) => {
    myModule.logout( req,res); 
});

app.post('/submitOCRResults', (req, res) => {
    
    const ocrResults = req.body.ocrResults;
    const updatedArrays = req.body.updatedArrays;
    console.log('Received OCR results:', ocrResults);
    console.log('Received updated arrays:', updatedArrays);
    res.json({ success: true, message: 'OCR results and arrays submitted successfully' });
});



app.post('/submitUserInfo', (req, res) => {
    const userData = req.body;
    db.query('INSERT INTO UserInfo (FirstName, LastName, UniversityName, Phone, Email, StudentID, Password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userData.firstName, userData.lastName, userData.universityName, userData.phone, userData.email, userData.studentId, userData.password],
        (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.json({ success: false, message: 'Student ID already exists. Please choose a different one.' });
                } else {
                    console.error('Error inserting user information:', error);
                    res.json({ success: false, message: 'Failed to insert user information' });
                }
            } else {
                req.session.studentId = userData.studentId;
                req.session.email = userData.email;
                console.log('User information inserted successfully');
                console.log('Stored studentId in session:', req.session.studentId);
                res.json({ success: true });
            }
        });
});





app.post('/saveSubjectData', async (req, res) => {
   
    const studentId = req.session.studentId;

 
    if (!studentId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const yearArray = req.body.yearArray;
    const sessionArray = req.body.sessionArray;
    const campusDeliveryArray = req.body.campusDeliveryArray;
    const subjectCodeArray = req.body.subjectCodeArray;

    

    
    const sql = 'INSERT INTO Subjects (StudentID, Year, Session, CampusDelivery, SubjectCode) VALUES (?, ?, ?, ?, ?)';

    try {
        for (let i = 0; i < yearArray.length; i++) {
            await new Promise((resolve, reject) => {
                db.query(sql, [studentId, yearArray[i], sessionArray[i], campusDeliveryArray[i], subjectCodeArray[i]], (err, result) => {
                    if (err) {
                        console.error('Error saving subject data into the database:', err);
                        reject(err);
                    } else {
                        console.log('Subject data saved into the database');
                        resolve();
                    }
                });
            });
        }

        res.json({ success: true, message: 'Subject data saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});




function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
app.post('/', async (req, res) => {
    console.log('Entered / route');

    try {
        console.log('Entered try route');
        console.log('Received data:', req.body); 
        const authenticationResult = await myModule.authenticateUser(req.body, req, connection);

        if (authenticationResult.success) {
            const user = authenticationResult.user;
            const otp = generateOTP();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'careerrbridge@gmail.com',
                    pass: 'psnyehoisrxetoyz',
                },
            });

            const mailOptions = {
                from: 'careerrbridge@gmail.com',
                to: user.Email,
                subject: 'Verification Code for Login',
                text: `Your verification code is: ${otp}`,
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                console.log('Entered transporter.sendMail callback');

                if (error) {
                    console.error('Error sending verification code:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log('Verification code sent:', info.response);

                    try {
                        await myModule.preAuthentication(req, res, user.StudentID);
                        req.session.verificationCode = otp;
                        console.log('authentication successful. Redirecting to verification.html');
                       res.redirect('/verification.html');
                    } catch (preAuthError) {
                        console.log('Pre-authentication failed:', preAuthError.response);
                        res.status(401).json(preAuthError.response);
                    }
                }
            });

        } else {
            res.status(401).json({ error: 'Incorrect username or password' });
            
        }
    } catch (error) {
        console.error('Error in authentication:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});


app.get('/', (req, res) => {
    myModule.login(res);
});


app.post('/send_reset_code', async (req, res) => {
    const studentId = req.body.studentId;
    console.log('Entered send reset code route');

    try {
        const sql = 'SELECT Email FROM userinfo WHERE StudentID = ?';
        connection.query(sql, [studentId], async (error, results) => {
            if (error) {
                console.error('Error fetching user email:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Student ID not found' });
            }

            const userEmail = results[0].Email;
            console.log(userEmail);
            const resetCode = generateOTP();

       
            req.session.resetCode = resetCode;
            req.session.studentId = studentId;

           
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'careerrbridge@gmail.com',
                    pass: 'psnyehoisrxetoyz',
                },
            });

            const mailOptions = {
                from: 'careerrbridge@gmail.com',
                to: userEmail,
                subject: 'Verification Code for Password Reset',
                text: `Your verification code for password reset is: ${resetCode}`,
            };

            transporter.sendMail(mailOptions, (sendMailError, info) => {
                if (sendMailError) {
                    console.error('Error sending reset code:', sendMailError);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                console.log('Reset code sent:', info.response);
                return res.status(200).json({ success: true, message: 'Reset code sent successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/verify_reset_code', (req, res) => {
    console.log('Entered verify server side reset code route');
   
    const enteredOTP = req.body.otp;
    const storedOTP = req.session.resetCode;
    console.log('Entered OTP:', enteredOTP);
    console.log('Stored OTP:', storedOTP);
    
    if (enteredOTP === storedOTP) {
       
        delete req.session.resetCode; 
        delete req.session.studentId; 
        
        res.status(200).json({ success: true, redirectToResetPassword: true ,
        message: 'Reset code verified successfully' });
    } else {
        
        const errorMessage = 'Invalid reset code. Please try again.';
        res.status(400).json({ error: errorMessage });
    }
});


app.post('/reset_password', async (req, res) => {
    const studentId = req.body.studentId;
    const newPassword = req.body.newPassword;
    console.log('Entered reset password route');
    console.log('Student ID:', studentId);
    console.log('New Password:', newPassword);

    try {
        const sql = 'UPDATE userinfo SET Password = ? WHERE StudentID = ?';
        connection.query(sql, [newPassword, studentId], (error, results) => {
            if (error) {
                console.error('Error updating password:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log('Password changed in the database');

            const selectSql = 'SELECT Email, FirstName, LastName FROM userinfo WHERE StudentID = ?';
            connection.query(selectSql, [studentId], (error, userInfo) => {
                if (error) {
                    console.error('Error fetching user info:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                const userEmail = userInfo[0].Email;
                const firstName = userInfo[0].FirstName;
                const lastName = userInfo[0].LastName;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'careerrbridge@gmail.com',
                        pass: 'psnyehoisrxetoyz',
                    },
                });        

                const mailOptions = {
                    from: 'careerrbridge@gmail.com',
                    to: userEmail,
                    subject: 'Password Reset Confirmation',
                    text: `Dear ${firstName} ${lastName}, your password has been successfully reset.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    console.log('Email sent successfully:', info.response);
                    res.redirect('/login');
                });
            });
        });
    
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/verify-otp', (req, res) => {
    const enteredOTP = req.body.otp;
    const sessionOTP = req.session.verificationCode;

    if (enteredOTP === sessionOTP) {
        req.session.verified = true;
        req.session.verificationCode = null; 
        myModule.renderMainPage(res, req.session.studentId, connection);

    } else {
        const errorMessage = 'Invalid OTP. Please try again.';

        fs.readFile('verification.html', (err, data) => {
            if (err) 
            {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end('404 Not Found');
            }

            const updatedData = data.toString().replace('<p id="errorMessage"></p>', `<p id="errorMessage">${errorMessage}</p>`);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(updatedData);
            console.log("Verify otp failed");
            return res.end();
        });
    }
});




app.get('/verification.html', (req, res) => {
    console.log('Before reading verification.html file');

    const filePath = path.join(__dirname, 'verification.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading verification.html:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Read verification.html successfully. Sending the file to the client.');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        }
    });

    console.log('After reading verification.html file');
});


app.post('/create_profile', (req, res) => {
    console.log('Received POST request to /create_profile');

    const studentId = req.session.studentId;
    console.log(studentId);
    const projects = req.body.projects;

    if (!studentId || !projects || !Array.isArray(projects)) {
        return res.status(401).json({ error: 'Unauthorized or Invalid request body.' });
    }

    const values = projects.map(project => [studentId, project.title, project.description]);

    const query = 'INSERT INTO Projects (StudentID, ProjectTitle, ProjectDescription) VALUES ?';

   
    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Error inserting projects into the database:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        } 
            console.log('Projects inserted successfully:', results);
            res.json({ success: true }); 
        
    });
});



app.post('/submit-certifications', (req, res) => {
    const studentId = req.session.studentId;
    const certifications = req.body.certifications;

    if (!studentId || !certifications || !Array.isArray(certifications)) {
        return res.status(401).json({ error: 'Unauthorized or Invalid request body.' });
    }

    const query = 'INSERT INTO Certifications (StudentID, CertName, CertDate, CertInstitute, Credly) VALUES ?';
    const values = certifications.map(certification => [
        studentId,
        certification.name,
        certification.acquired,
        certification.institution,
        certification.credlyLink || null,
    ]);

    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Error inserting certifications into the database:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        console.log('Certifications inserted successfully:', results);
        return res.json({ success: true });
    });
});

app.post('/submit-past-experience', (req, res) => {
    const studentId = req.session.studentId;
    const pastExperiences = req.body.pastExperiences;

    if (!studentId || !pastExperiences || !Array.isArray(pastExperiences)) {
        return res.status(401).json({ error: 'Unauthorized or Invalid request body.' });
    }

    const query = 'INSERT INTO PastExp (StudentID, JobTitle, CompanyName, StartDate, EndDate) VALUES ?';
    const values = pastExperiences.map(experience => [
        studentId,
        experience.jobTitle,
        experience.company,
        experience.startDate,
        experience.endDate
    ]);

    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Error inserting past experiences into the database:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        console.log('Past experiences inserted successfully:', results);
        return res.json({ success: true });
    });
});


app.use(express.json());

app.post('/saveData', (req, res) => {
    const studentId = req.session.studentId;

    const {
        name,
        address,
        phone,
        profile,
        education,
        experience,
        projects,
        skills,
        certifications,
        languages,
        awards
    } = req.body;

    const sanitizedExperience = experience === 'No relevant data' ? null : experience;
    const sanitizedProjects = projects === 'No relevant data' ? null : projects;

    const sqlFetchUserData = `SELECT Email, UniversityName FROM userinfo WHERE StudentID = ?`;

    connection.query(sqlFetchUserData, [studentId], (err, userDataResults) => {
        if (err) {
            console.error('Error fetching user data from the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('userDataResults:', userDataResults); 
        if (userDataResults.length === 0) {
            console.error('User data not found for studentID:', studentId);
            res.status(404).json({ error: 'User data not found' });
            return;
        }

        const { Email: email, UniversityName: university } = userDataResults[0];
        console.log(email);
        console.log(university);
        const data = {
            studentId,
            name,
            address,
            phone,
            email,
            profile,
            education,
            university,
            experience: sanitizedExperience,
            projects: sanitizedProjects,
            skills,
            certifications,
            languages,
            awards
        };

        req.session.cvData = data;
        console.log(data);
        const sqlInsertCV = `INSERT INTO editedCV (StudentID, name, address, phone, profile, education, projects, experience, skills, certifications, languages, awards) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(sqlInsertCV, [studentId, name, address, phone, profile, education, projects, experience, skills, certifications, languages, awards], (err, result) => {
            if (err) {
                console.error('Error saving edited CV:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log('Edited CV saved successfully');
            res.redirect('/index');
        });
    });
});


app.post('/indexData', (req, res) => {
    const data = req.session.cvData;

    if (data) {
        console.log("Sending index Data from session");
        res.send(data);
    } else {
        console.log("No saved CV data found in session");
        res.status(404).json({ error: 'Saved CV data not found in session' });
    }
});



app.post('/Generate_CV', async (req, res) => {
    try {

      const studentId = req.session.studentId;
      if (req.session.generatedData) {
        const { userData, generatedCV } = req.session.generatedData;
        return res.send({ userData, generatedCV });
    }
    console.log("Fetching data from the database for Student ID:", studentId);

      const subjectsQuery = `
        SELECT all_subjects.SubjectOutline
        FROM subjects
        JOIN all_subjects ON subjects.SubjectCode = all_subjects.SubjectCode
        WHERE subjects.StudentID = ?;`;
  
      const userInformationQuery = `
        SELECT FirstName, LastName, Phone, Email , UniversityName FROM userinfo
        WHERE StudentID = ?;`;

      const certificationsQuery = `
        SELECT CertName, CertDate, CertInstitute, Credly FROM certifications
        WHERE StudentID = ?;`;
  
      const pastExperienceQuery = `
        SELECT JobTitle, CompanyName, StartDate, EndDate FROM pastexp
        WHERE StudentID = ?;`;
  
      const projectsQuery = `
        SELECT ProjectTitle, ProjectDescription FROM projects
        WHERE StudentID = ?;`;
  
      const dbQueryPromise = (query, params) => {
        return new Promise((resolve, reject) => {
          db.query(query, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
          });
        });
      };
  
      
      const userResults = await dbQueryPromise(userInformationQuery, [studentId]);
      const results = await dbQueryPromise(subjectsQuery, [studentId]);
      
  
        if (userResults && userResults.length > 0) {
            const userData = userResults.map(result => ({
                firstName: result.FirstName,
                lastName: result.LastName,
                phone: result.Phone,
                email: result.Email,
                UniversityName: result.UniversityName
            }));
                if (results && results.length > 0) {
        const subjectData = results.map(result => ({
          outline: result.SubjectOutline,
                }));

                const certificationsResults = await dbQueryPromise(certificationsQuery, [studentId]);

             
                const pastExperienceResults = await dbQueryPromise(pastExperienceQuery, [studentId]);

               
                const projectsResults = await dbQueryPromise(projectsQuery, [studentId]);

                let certificationsData = [];
                let pastExperienceData = [];
                let projectsData = [];


                if (certificationsResults && certificationsResults.length > 0) {
                    certificationsData = certificationsResults.map(result => ({
                        certName: result.CertName,
                        certDate: result.CertDate,
                        certInstitute: result.CertInstitute,
                        credly: result.Credly,
                    }));
                }

                if (pastExperienceResults && pastExperienceResults.length > 0) {
                    pastExperienceData = pastExperienceResults.map(result => ({
                        jobTitle: result.JobTitle,
                        companyName: result.CompanyName,
                        startDate: result.StartDate,
                        endDate: result.EndDate,
                    }));
                }

                if (projectsResults && projectsResults.length > 0) {
                    projectsData = projectsResults.map(result => ({
                        projectTitle: result.ProjectTitle,
                        projectDescription: result.ProjectDescription,
                    }));
                }
                    //write gemini prompt and save it to a variable called geminiPrompt 
                const geminiPrompt = ` 
                You are a professional CV maker. You are tasked with writing a CV for a University student. You will be given details of the subject outline of each subject the student took. You will analyze the subject outlines given and use only the subjects that align with the job description.
                Use the provided job description but don't directly copy it , make it seem more human written and it should still showcase the user's capabalities. Use only the relevant subject outlines to format the CV and disregard the rest.
            
                Make all the text normal dont add bold, do NOT add ** at all. Always ddd one # only after each section.

                Provided Subject Outline:
                ${results}
                
                CV Format:
                User Details:
                - Full Name: ${userData[0].firstName} ${userData[0].lastName}
                - Phone Number: ${userData[0].phone}
                - Email: ${userData[0].email}
                - Universty: ${userData[0].UniversityName}
                About Me:
                - [Add a reliable about me section based on the relavent subject outlines , not less than 100 words ]

                Skills:
                - [List skills based on the relavent subject outline]
            
                
                - [List relevant past experiences only based on the extracted , don't data about the experencie if not given  ]
                Experience:if there are Experience extracted )
                ${pastExperienceData.map(exp => `- ${exp.jobTitle} at ${exp.companyName}, ${exp.startDate} - ${exp.endDate}`).join('\n') || 'No experiences available'}
                Certifications:(if there are ertification extracted )
                ${certificationsData.map(cert => `- ${cert.certName}, ${cert.certDate}, ${cert.certInstitute}`)}
            
                Projects:
                ${projectsData.map(project => `- ${project.projectTitle}: ${project.projectDescription}`).join('\n') || 'No projects available'}
                if there are no projects , experience and certifications in relevant extracted don't put it in the CV format
                Additional Prompt: ${req.body.jobDescription || ''}
                use only the data given , if there are no certifications or experencise don't  put them in the CV, just stick to the data is being handled 
            `;
              
            console.log('Gemini Prompt:', geminiPrompt);

            console.log('results:',results)
            const generatedContent = await myModule.generateContent(geminiPrompt);
            console.log('Generated Content:', generatedContent);
            const generatedCV = generatedContent; 

            

            console.log("Generated in function : ", generatedCV);

                

            const sections = generatedCV.split('#');

            sections.shift();

            const trimmedSections = sections.map(section => section.trim());

            console.log("Trimmed Session: ", trimmedSections);
            const userDetails = trimmedSections[0];
            const about = trimmedSections[1];
            const skills = trimmedSections[2];
            const experience = trimmedSections[3];
            const projects = trimmedSections[4];
            const certifications = trimmedSections[4];


            console.log('userDetails:', userDetails);
            console.log('about:', about);
            console.log('skills:', skills);
            console.log('experience:', experience);
            console.log('certifications:', certifications);
            console.log('projects:', projects);

            const userDetailsObj = {};
            userDetails.split('\n').forEach(line => {
                const info = line.trim().replace('-', '').split(':');
                if (info.length === 2) {
                    const key = info[0].trim();
                    const value = info[1].trim();
                    userDetailsObj[key] = value;
                }
            });

            const fullName = userDetailsObj['Full Name'];
            const phoneNumber = userDetailsObj['Phone Number'];
            const email = userDetailsObj['Email'];
            const university = userDetailsObj['University'];


            fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, indexHtml) => {
                if (err) {
                    console.error('Error reading index HTML file:', err);
                    return res.status(500).send('Internal Server Error');
                }

                console.log("Read index HTML content successfully");

                fs.readFile(path.join(__dirname, 'edit-cv.html'), 'utf-8', (err, editCvHtml) => {
                    if (err) {
                        console.error('Error reading edit-cv HTML file:', err);
                        return res.status(500).send('Internal Server Error');
                    }

                    console.log("Read edit-cv HTML content successfully");

                    const userData = {
                        userDetails: userDetailsObj,
                        about: about,
                        skills: skills,
                        experience: experience,
                        certifications: certifications,
                        projects: projects
                    };
                    console.log("\n\n Data that is taken to edit cv:", userData);
                    req.session.generatedData = { userData, generatedCV };
                    console.log(generatedCV);
                    res.send({ userData, generatedCV });      
                 });
            });
            

    

            console.log('Full Name:', fullName);
            console.log('Phone Number:', phoneNumber);
            console.log('Email:', email);
            console.log('University:', university);
            
            console.log('about:', about);
            console.log('skills:', skills);
            console.log('experience:', experience);
            console.log('certifications:', certifications);
            console.log('projects:', projects);


            } else {
                console.error('Unexpected structure of subject query results:', results);
                return res.status(500).send('Error generating content');
            }
        } 
    } catch (error) {
        if (error.response && error.response.candidates) {
            console.error('Google Generative AI Error:', error.message);
            console.error('Response:', error.response);
        } else {
            console.error('Error:', error.message);
        }
        return res.status(500).send('Error generating content');
    }
});




app.get('/getRecommendedCertifications', async (req, res) => {
    try {
        const studentID = req.session.studentId;

        const coursesQuery = 'SELECT all_subjects.SubjectName FROM Subjects JOIN all_subjects ON Subjects.SubjectCode = all_subjects.SubjectCode WHERE Subjects.StudentID =?;';

        const dbQueryPromise = (query, params) => {
            return new Promise((resolve, reject) => {
                db.query(query, params, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
        };

      
        const coursesResult = await dbQueryPromise(coursesQuery, [studentID]);

        if (Array.isArray(coursesResult)) {
            const coursesData = coursesResult.map(course => course.SubjectName); 

            const geminiCertPrompt = `
              You will be given the names of the courses taken, based on the courses recommend 4 
              certificates that can either build upon the course or may be interesting and 
               relate to the courses. Here are the course names: ${JSON.stringify(coursesData)}

           Strictly Follow this format for the result and have one space line in between each certification and don't put any special characters such a *
            Certification Name  
            Certification Education Provider
            Certification Description
            Estimated Course Completion

            Certification Name  
            Certification Education Provider
            Certification Description
            Estimated Course Completion

            Certification Name  
            Certification Education Provider
            Certification Description
            Estimated Course Completion

            For instance of a result:
            
            AWS Certified Solutions Architect - Associate
            Certification Education Provider: Amazon Web Services (AWS)
            Certification Description: Demonstrates expertise in designing and implementing cloud solutions on AWS.
            Estimated Course Completion: 6-9 months

            Microsoft Certified: Azure Solutions Architect Expert
            Certification Education Provider: Microsoft
            Certification Description: Validates the ability to design, implement, and manage cloud solutions on Microsoft Azure.
            Estimated Course Completion: 9-12 months

            Certified Information Systems Security Professional (CISSP)
            Certification Education Provider: (ISC)²
            Certification Description: Demonstrates expertise in information security and compliance.
            Estimated Course Completion: 6-9 months
                        `;

            const generatedCertContent = await myModule.generateContent(geminiCertPrompt);

            console.log(geminiCertPrompt);
            console.log(generatedCertContent);

            const regex = /([^]+?)\n([^]+?)\n([^]+?)\n([^]+?)\n/g;

            let match;
            const recommendedCertifications = [];

            while ((match = regex.exec(generatedCertContent)) !== null) {
                const certification = {
                    name: match[1].trim(),
                    provider: match[2].trim(),
                    description: match[3].trim(),
                    completion: match[4].trim()
                };
                
                recommendedCertifications.push(certification);

                if (recommendedCertifications.length === 4) {
                    break;
                }
            }

            console.log('Recommended Certifications:', recommendedCertifications);

            res.send(recommendedCertifications);
        } else {
            console.error('Invalid result from the database:', coursesResult);
            res.status(500).send('Error fetching recommended certifications');
        }
    } catch (error) {
        console.error('Error fetching recommended certifications:', error);
        res.status(500).send('Error fetching recommended certifications');
    }
});

const availableSlots = [
    '2024-04-12 12:00:00',
    '2024-04-12 14:00:00',
    '2024-04-12 16:00:00'
];

app.get('/getAppointmentSlots', (req, res) => {
    res.json(availableSlots);
});

app.post('/reserveAppointment', (req, res) => {
    const chosenSlot = req.body.time;
    const mentor = req.body.mentor;
    const dateBooked = req.body.date;
    const studentID = req.session.studentId; 

    const reserveAppointment = () => {
        const insertQuery = `
            INSERT INTO mentorshipBooking (StudentID, mentor, dateBooked, timeBooked)
            VALUES (?, ?, ?, ?);
        `;

        db.query(insertQuery, [studentID, mentor, dateBooked, chosenSlot], (err, result) => {
            if (err) {
                console.error('Error saving appointment:', err);
                res.status(500).send('Error saving appointment');
            } else {
                console.log('Appointment saved successfully.');
               
                res.json({ success: true });

                const fetchUserEmailQuery = 'SELECT Email FROM userinfo WHERE StudentID = ?';

                db.query(fetchUserEmailQuery, [studentID], (error, results) => {
                    if (error) {
                        console.error('Error fetching user email:', error);
                        res.status(500).send('Error saving appointment');
                    }

                    if (results && results.length > 0) {
                        const userEmail = results[0].Email;

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'careerrbridge@gmail.com',
                                pass: 'psnyehoisrxetoyz'
                            },
                            logger: true,  
                        });

                        const mailOptions = {
                            from: 'careerrbridge@gmail.com',
                            to: userEmail,
                            subject: 'Mentorship Appointment Confirmation',
                            text: `Your mentorship appointment for ${chosenSlot} with ${mentor} is confirmed.`
                        };

                        transporter.sendMail(mailOptions, (sendMailError, info) => {
                            if (sendMailError) {
                                console.error('Error sending confirmation email:', sendMailError);
                                res.status(500).send('Error sending confirmation email');
                            } else {
                                console.log('Email sent:', info.response);
                                res.sendStatus(200);
                            }
                        });
                    } else {
                        res.status(404).send('User not found or email not available.');
                    }
                });
            }
        });
    };

    if (req.session && req.session.studentId) {
        reserveAppointment();
    } else {
        res.status(401).send('Unauthorized');
    }
});






async function generateContentWithRetries(prompt, maxRetries = 3) {
    let retries = 0;
    let lastError;

    while (retries < maxRetries) {
        try {
            const result = await myModule.generateContent(prompt);
            return result;
        } catch (error) {
            lastError = error;
            console.error(`Error generating content (Retry ${retries + 1}):`, error.message);
            retries++;
        }
    }

    throw lastError;
}





app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



