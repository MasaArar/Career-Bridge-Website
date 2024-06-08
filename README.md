##Setting up Google Cloud Platform to use the Gemini API

Please go to the google cloud website: https://cloud.google.com/gcp/ or search google cloud console.

![image24](https://github.com/MasaArar/Career-Bridge-Website/assets/88930557/03006d23-8120-47c9-9e95-73e1d02c4c0f)

Press on “Get started for free”


Please continue with filling out your details, it will ask you for billing information. It will NOT charge you for anything using this project so please follow the instructions carefully.

You can copy what I wrote EXCEPT my name.
Fill out the payment information. It says that no automatic payments will be made.
Press on “Start Free”.
You will then be given a pop up, feel free to fill it up the same way that is provided in the images:






After completing it you will be redirected to this page:


Click on “My First Project” as shown:


Click on new project:



Input the same information as in the image and click “CREATE”:



Click on “My First Project” again:

Click on “Career Bridge”





Now go to these 2 links and enable “Generative Language API” and “Vertex AI API”: https://console.cloud.google.com/marketplace/product/google/generativelanguage.googleapis.com?q=search&referrer=search&project=career-bridge-418220 

https://console.cloud.google.com/marketplace/product/google/aiplatform.googleapis.com?q=search&referrer=search&project=career-bridge-418220 



After enabling them you will be redirected to this page, press on the hamburger menu located on the top left:


Click on “IAM and Admin”:


Then start editing:



Add the following roles and save the changes:



Now we are done with google cloud configuration. We can now install the cloud CLI.
Open this link to follow your systems OS, I am using windows so will show the steps for windows: https://cloud.google.com/sdk/docs/install 


Copy the command and run it on your powershell:



Go through the installation steps.


Save the installation space so you can use it later.


Press next.

Click on finish and the google cloud CLI should open by itself



Log in with the account you just set up on google cloud.


Allow everything
Now that you are logged in go back to the open terminal


Please pick the one we just made, which is career bridge.
IF you close the terminal tab by mistake before logging in type “gcloud init” you will get the same script.
Now we need to add an api key and use it.
First download the code zip file and extract it in the Cloud SDK file that i asked you to save earlier: C:\Users\masaa\AppData\Local\Google\Cloud SDK


Go back to api and services:



Go to credentials and create new credentials 


Pick API key 



Set the settings as follows:



Copy key



Navigate to the file called .env



Replace the api key.





Node.js installation:


1.

2.

3.

4.

5.

6.

7.

8.

9. Once you print finish ,  terminal would pop up 




Create a folder in and call it node then run the Command Prompt, then go to the folder node,then after you are inside the folder node,open terminal in that file

Run the following statements on the google CLI:
npm install dotenv
npm install @google/generative-ai 





Now install the following libraries:

npm install iconv-lite
npm install express
npm install mysql
npm install body-parser
npm install path
npm install nodemailer
npm install fs
npm install nodemailer
npm install pako
npm install fontkit
npm install util
npm install express-session
npm install express-mysql-session
npm install @pdf-lib/core
npm install @pdf-lib/fontkit @pdf-lib/standard-fonts
npm install express-mysql-session
npm install mysql2@latest

After installing it all please open the mySQL file and run the tables as follows:


Then run all tables.
Then  run all the insert statement.
Lastly run the alter and flush statements but with your details:


Lastly Run ‘node db.js’ in the projects terminal:

