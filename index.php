<?php


?>


<!DOCTYPE html>
<html>
<head>
	 
	<title> Template </title>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<meta name="description" content="This ">

	<meta name="author" content="Code With Mark">
	<meta name="authorUrl" content="http://codewithmark.com">

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> 
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css">


	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.min.js"></script> 

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.0.272/jspdf.debug.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js"></script>

	<script src="<?php echo $app_url?>/af.min.js"></script> 
  
 	
	<style>
        .invoice-box {
		max-width: 800px;
		margin: auto;
		padding: 30px;
		border: 1px solid #eee;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
		font-size: 16px;
		line-height: 24px;
		font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
		color: #555;
        }

        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }

        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }

        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }

        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
            border-bottom: none;
        }

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }

        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
            }

            .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
            }
        }

        /** RTL **/
        .invoice-box.rtl {
            direction: rtl;
            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        }

        .invoice-box.rtl table {
            text-align: right;
        }

        .invoice-box.rtl table tr td:nth-child(2) {
            text-align: left;
        }

        body {
            margin: 0; 
            padding: 0; 
        }

        .header {
            margin: 2.5em 0 3em 0;
            padding-bottom: 1.5em;
            border-bottom: 1px solid #cccccc;
            text-align: left;
            font-family: Georgia;
            color: #444;
            padding-right: 10%;
            padding-left: 10%; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 

        .header h1,
        .header h2 {
            margin: 0; 
        }

        .details {
            text-align: right; 
        }

        h1 {
            font-size: 40px;
            font-style: bold;
        }

        h2 {
            font-size: 20px; 
            color: #797575;
        }

        h3 {
            font-size: 18px;
            color: #797575;
            margin-top: 5px;
        }

        .content {
            padding-right: 10%;
            padding-left: 6%;
        }

        h4 {
            text-align: left;
            color: #797575;
            font-size: 25px;
        }

        p {
            color: #444444;
            font-family: Garamond, Georgia, serif;
            font-size: 20px;
        }

        h5 {
            text-align: right;
            font-size: 15px;
            margin-top: -30px; 
        }

        h4.experience {
            text-align: left;
            color: #797575;
            font-size: 20px;
        }

        h6 {
            text-align: right;
            font-size: 15px;
            top: 40px;
        }

        li{
            font-family: Garamond, Georgia, serif;
            font-size: 20px;
            color: #444444;

        }
    </style>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js" ></script>

 

	<script type="text/javascript">

	$(document).ready(function($) {
            $(document).on('click', '.btn_print', function(event) {
                event.preventDefault();

                var element = document.getElementById('container_content');
                var pdf = new jsPDF();

                html2pdf(element, { jsPDF: pdf }).then(() => {
                    pdf.save('pageContent.pdf');
                });
            });
        });
	</script>

	 

</head>
<body>

<div class="text-center" style="padding:20px;">
	<input type="button" id="rep" value="Download" class="btn btn-info btn_print">
</div>

<div class="container_content" id="container_content" >
		

		<div class="invoice-box">

     
            <div class="header"> <!-- HEADER-->
                <div>
                    <h1> <!--Name--> </h1>
                    <h2> Occupation</h2>
                </div>
                <div class="details">
                    <h3> <!--Email--></h3>
                    <h3> <!--Phone--></h3>
                    <h3> <!--UniName--></h3>
                </div>
            </div>

            <div class="content">
                <div class="proSummary">
                    <h4> Professional Summary</h4>
                    <p> <%= generatedContent.aboutMe %> </p>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div>

                <div class="info">
                    <h4> Experience </h4>
                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > Teacher <span style="float: right; color: #444444;"> 2012-2015</span></h4>
                        <p><% if (Array.isArray(generatedContent.pastExperienceData) && generatedContent.pastExperienceData.length > 0) { %>
                            <% for (const exp of generatedContent.pastExperienceData) { %>
                                <li><%= exp.jobTitle %> at <%= exp.companyName %>, <%= exp.startDate %> - <%= exp.endDate %></li>
                            <% } %>
                        <% } else { %>
                            <li>No experiences available</li>
                        <% } %></p>
                    </div>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div>

                <div class="info">
                    <h4> Certifications </h4>
                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > Bachlors in Mathematics <span style="float: right; color: #444444;"> 2012-2015</span></h4>
                        <p><% if (Array.isArray(generatedContent.certificationsData) && generatedContent.certificationsData.length > 0) { %>
                            <h2>Certifications:</h2>
                            <ul>
                                <% for (const cert of generatedContent.certificationsData) { %>
                                    <li><%= cert.certName %>, <%= cert.certDate %>, <%= cert.certInstitute %></li>
                                <% } %>
                            </ul>
                        <% } else { %>
                            <p>No certifications available</p>
                        <% } %></p>
                        <h4 style="font-size: 20px;color: #444444; " > Masters in Mathematics <span style="float: right; color: #444444;"> 2016-2018</span></h4>
                        <p>Specialization in Applied Mathematics with a focus on data analysis and mathematical modeling
                            Coursework included Advanced Calculus, Linear Algebra, Probability Theory, Statistical Methods, and Numerical Analysis </p>
                    </div>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div>

                <div class="projects">
                    <h4> Projects </h4>
                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > Financial Portfolio Optimization Project
                            <span style="float: right; color: #444444;"> 2020</span></h4>
                        <p> <% if (Array.isArray(generatedContent.projectsData) && generatedContent.projectsData.length > 0) { %>
                            <% for (const project of generatedContent.projectsData) { %>
                                <li><%= project.projectTitle %>: <%= project.projectDescription %></li>
                            <% } %>
                        <% } else { %>
                            <li>No projects available</li>
                        <% } %></p>
                    </div>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div>

            <div class="info">
                    <h4>Skills</h4>
                    <div class="experience">
                        <li> <%= generatedContent.skill1 %> </li>
                        <li> <%= generatedContent.skill2 %> </li>
                        <li><%= generatedContent.skill3 %></li>

                    </div>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div> 

                <div class="info">
                    <h4> Certifications </h4>
                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > Chartered Financial Analyst (CFA) <span style="float: right; color: #444444;"> 2012-2015</span></h4>
                        <p> This is a globally recognized certification for investment management professionals. It covers a broad range of topics including investment analysis, portfolio management, and ethics. </p>
                    </div>

                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > Financial Risk Manager (FRM) <span style="float: right; color: #444444;"> 2012-2015</span></h4>
                        <p> The FRM certification focuses on risk management in finance, covering topics such as market risk, credit risk, and operational risk. </p>
                    </div>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div>

                <div class="info">
                    <h4> Languages </h4>
                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > English | Fluent </h4>
                        <h4 style="font-size: 20px;color: #444444; " > Arabic  | Speaking Only </h4>
                        <h4 style="font-size: 20px;color: #454141; " > Spanish | Beginner </h4>

                    
                    </div>
                    <hr width="100%" size="2" color="#cccccc" noshade>
                </div>

                <div class="info">
                    <h4> Achievements</h4>
                    <div class="experience">
                        <h4 style="font-size: 20px;color: #444444; " > Academic Achievements </h4>
                        <p> Achieved a cumulative GPA of 3.8/4.0 while completing a Bachelor of Science in Finance.
                    
                            <h4 style="font-size: 20px;color: #444444; " > Certification Achievements</h4>
                            <p> Achieved the Financial Risk Manager (FRM) certification with distinction, scoring in the top 5% of candidates.</p>
                        </p>
                    </div>
                </div>

                <br>
                <br>
                <br>


            </div>
        </div>
    </div>     
</body>
</html>