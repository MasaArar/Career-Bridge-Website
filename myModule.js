var mysql = require('mysql2');
var fs = require('fs');

const { PDFDocument } = require('pdf-lib');


exports.connectToDB = function ()
{
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "ShnayZoop11!",
        database: "proj_321"
    });
    return con;
};

exports.preAuthentication = function (req, res, studentId) {
    console.log('Entered preAuthentication');  

    if (studentId) {
        
        if (req && req.session) {
            req.session.studentId = studentId;
        }

       
        console.log('Pre-authentication success: StudentId set in session');
        console.log('student id in session :',studentId);
        return { success: true, response: { message: 'StudentId set in session' } };

    } else {
        console.log('Pre-authentication failed: Invalid StudentId');
        return { success: false, response: { error: 'Invalid StudentId' } };
    }
};

const getUserDetails = function (studentId, connection) {
    return new Promise((resolve, reject) => {
        if (!connection || typeof connection.query !== 'function') {
            console.error('Invalid database connection');
            reject({ success: false, response: { error: 'Internal Server Error' } });
            return;
        }

        const sql = "SELECT * FROM userinfo WHERE StudentID = ?";
        connection.query(sql, [studentId], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject({ success: false, response: { error: 'Internal Server Error' } });
                return;
            }

            if (result !== undefined && result.length > 0) {
                resolve({ success: true, user: result[0] });
            } else {
                reject({ success: false, response: { error: 'User details not found' } });
            }
        });
    });
};


exports.renderMainPage = function (res, studentId, connection) {
    getUserDetails(studentId, connection)
        .then((userDetails) => {
            if (userDetails.success) {
                const firstName = userDetails.user.FirstName;
                const lastName = userDetails.user.LastName;
                console.log('first name:',firstName);
                console.log('last name :',lastName);
                fs.readFile('MainNEW.html', 'utf-8', function (err, data) {
                    if (err) {
                        console.error('Error reading HTML file:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    const modifiedHtml = data.replace('<!--FIRST_NAME-->', firstName).replace('<!--LAST_NAME-->', lastName);

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(modifiedHtml);
                    res.end();
                });
            } else {
                console.error('Error fetching user details:', userDetails);
                res.status(500).send('Internal Server Error');
            }
        })
        .catch((error) => {
            console.error('Error in fetching user details:', error);
            res.status(500).send('Internal Server Error');
        });
};


exports.renderCVPage = async function (res, studentId, connection, generatedContent) {
    console.log("In renderCV");

    try {
        const userDetails = await getUserDetails(studentId, connection);

        if (!userDetails.success) {
            console.error('Error fetching user details:', userDetails);
            throw new Error('Internal Server Error: Error fetching user details');
        }

        const name = userDetails.user.FirstName + " " + userDetails.user.LastName;
        const email = userDetails.user.Email;
        const phone = userDetails.user.Phone;
        const uniName = userDetails.user.UniversityName;

        console.log("User details", userDetails);

        res.send(`
            <script>
                // Set user details using JavaScript
                document.getElementById('userName').innerText = '${name}';
                document.getElementById('userEmail').innerText = '${email}';
                document.getElementById('userPhone').innerText = '${phone}';
                document.getElementById('userUniName').innerText = '${uniName}';
            </script>
        `);
        res.status(500).json({ error: error.message });

    } catch (error) {
        console.error('Error in rendering CV page:', error);
    }
};    


exports.authenticateUser = function (body, req, connection) {
    const studentId = body.studentId;
    const password = body.password;
    
    return new Promise((resolve, reject) => {
        if (!connection || typeof connection.query !== 'function') {
            console.error('Invalid database connection');
            reject({ success: false, response: { error: 'Internal Server Error' } });
            return;
        }

        const sql = "SELECT * FROM userinfo WHERE StudentID = ? AND Password = ?";
        connection.query(sql, [studentId, password], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject({ success: false, response: { error: 'Internal Server Error' } });
                return;
            }

            if (result !== undefined && result.length > 0) {
                if (req.session) {
                    req.session.studentId = studentId;
                }

                resolve({ success: true, user: result[0] });
                console.log("correct credentials");
            } else {
                console.log('here');
            reject({ success: false, response: { error:'Invalid credentials' } });
            }
        });
    });
};


exports.login = function (res)
{
    fs.readFile("login.html", function (err, data)
    {
        if (err)
        {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
};


exports.logout = function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error clearing session:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        console.log('Session ended');

        fs.readFile("login.html", function (err, data) {
            if (err) {
                res.status(404).send("404 Not Found");
                return;
            }
            res.status(200).send(data);
        });
    });
};


const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');


dotenv.config();

const api_key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });
exports.model = model;


exports.generateContent = async function (content) {
  try {
    const result = await model.generateContent(content);
    const contentString = result.response.text();
    return contentString;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Error generating content');
  }
};



exports.generatePdf = async function (filledTemplate) {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        const fontSize = 15;
        const text = filledTemplate;

        page.drawText(text, {
            x: 50,
            y: height - 4 * fontSize,
            fontSize: fontSize,
        });

        const pdfBytes = await pdfDoc.save();

        console.log('PDF Generation Successful!');
        return pdfBytes;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error generating PDF');
    }
};
