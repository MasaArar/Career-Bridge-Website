create database proj_321;
use proj_321;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ShnayZoop11!';

flush privileges;

CREATE TABLE Subjects (
    StudentID VARCHAR(7),
    Year VARCHAR(4),
    Session VARCHAR(10),
    CampusDelivery VARCHAR(50),
    SubjectCode VARCHAR(10)
);

Create table CareerServiceBooking  (
StudentID VARCHAR(7) ,
timeDate datetime

);

Create table pastexp (
StudentID VARCHAR(7),
JobTitle varchar(100),
CompanyName varchar(100) ,
StartDate date,
EndDate date
);

create table certifications(
StudentID VARCHAR(7),
CertName varchar(100),
CertDate date,
CertInstitute varchar(100), 
Credly varchar(500)
);

create table Projects(
StudentID VARCHAR(7) ,
ProjectTitle varchar(50),
ProjectDescription varchar(2500)
);


Create table mentorshipBooking  (
StudentID VARCHAR(7),
mentor varchar(100),
dateBooked date,
timeBooked time
);

create table all_subjects(
SubjectCode Varchar(10),
SubjectName Varchar(50),
SubjectOutline Varchar(2000)
);

Create table userinfo  (
FirstName varchar(20),
LastName varchar(50),
UniversityName Varchar(100),
StudentID varchar(7) primary key,
Phone Varchar(15),
Email Varchar(50),
Password varchar(50),
Major Varchar(50)
);

create table sessions (
session_id varchar(128) primary key,
expires int unique,
data mediumtext
);
create table editedCV(
StudentID varchar(7),
name varchar(100),
address varchar(500),
phone varchar(15),
profile varchar(2000),
education varchar(2000),
projects varchar(2000),
experience varchar(2000),
skills varchar(2000),
certifications varchar(2000),
languages varchar(1000),
awards varchar(2000)
);





INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT111', 'Programming Fundamentals', 'The broad aim of this subject is to develop in students an understanding of the fundamental principles of programming. 
This subject explores object-oriented problem analysis and resolution, fostering skills in designing and implementing structured programs. Upon completion, students will adeptly handle data types, implement solutions using classes, apply language rules, demonstrate program testing proficiency, and grasp compilation and execution concepts.');


INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT113', 'Problem Solving', 'This subject explores problem analysis and management strategies in computing. It covers problem classification, formal and informal problem-solving approaches, method classification, and comparative analysis of strategies. Students will master problem categorization, representation formulation, identification and application of problem-solving strategies, evaluation of strategy performance, and effective documentation of analyses and group work strategies.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT115', 'Data Management & Security', 'This subject covers fundamental concepts in data management systems, including data modeling, relational databases, and SQL for data processing. It emphasizes data security principles, addressing topics like access control, user management, and ethical considerations. Students gain skills in designing databases, processing data, and implementing security measures to safeguard data systems from potential threats and vulnerabilities.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT121', 'Object Oriented Design and Programming
', 'This subject enhances students programming skills with a focus on structured and object-oriented approaches. Emphasizing good coding style, it covers essential concepts like encapsulation, inheritance, and polymorphism. Students develop proficiency in designing and implementing object-oriented programs to solve business problems, with an emphasis on maintainability and reuse principles.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT127', 'Networks and Communications
', 'This subject provides a foundational understanding of data communications and computer networks, covering topics such as signal modulation, network architectures, and emerging technologies. It explores models like the ISO reference model and TCP/IP protocol Suite, enabling students to describe technologies, select appropriate solutions for different contexts, and design small business networks collaboratively. The course emphasizes professional practices and standards in the field of data communications and networking.');
INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT127', 'Networks and Communications
', 'This subject provides a foundational understanding of data communications and computer networks, covering topics such as signal modulation, network architectures, and emerging technologies. It explores models like the ISO reference model and TCP/IP protocol Suite, enabling students to describe technologies, select appropriate solutions for different contexts, and design small business networks collaboratively. The course emphasizes professional practices and standards in the field of data communications and networking.');
INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT128','Introduction to Web Technology','This subject offers a foundational overview of web technologies, covering internet communications, client-server systems, HTML5/CSS/XHTML/XML markup languages, and web forms. Students engage in practical exercises to build dynamic websites and gain insights into client-side and server-side web development. The curriculum emphasizes scripting for simple applications, understanding web standards, and staying updated with forthcoming W3C recommendations. Upon completion, students can confidently apply web technologies, handle web forms, and design basic web-based applications with a focus on client-side scripting.');
INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT214', 'IT Project Management
', 'This subject introduces students to project management methodologies in the context of information technology and software development. It covers stakeholder analysis, project planning, risk management, and ethical considerations. Through case studies, students demonstrate core knowledge and apply project management skills to solve practical problems. Successful completion equips students to select and deploy methods, collaborate in teams, communicate with stakeholders, and make ethical decisions in IT and software projects, emphasizing professional and social responsibility.');
INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT226
', 'Human Computer Interaction
', 'The subject explores Human-Computer Interaction (HCI) principles and practices for developing interactive computer applications. It highlights the importance of considering contextual, organizational, and social factors in system design. Students engage in hands-on design projects, covering topics like user-centered design, prototyping, usability testing, and evaluating the user experience. Upon completion, students gain skills in identifying HCI principles, justifying design solutions, understanding the HCI design process, and measuring and evaluating user experiences.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSCI251
','Advanced Programming
', 'This subject delves into diverse programming features in C++, spanning procedural, object-based, object-oriented, and generic programming. Covering essentials like memory management, classes, and advanced features, it also explores C++11 and C++14 standards. Successful completion empowers students to adeptly design and implement C++ solutions, incorporating procedural and object-oriented approaches, utilizing generic programming, and leveraging advanced features for efficient implementations. Textbook details are available upon request.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('MATH221
', 'Mathematics for Computer Science
', 'MATH221 provides essential skills for computer science learning, focusing on logic, formal proof, data structures, and their relations. Students engage with mathematical concepts such as sets, bijections, equivalence classes, and graphs, gaining hands-on experience in manipulating these structures. Upon completion, students can apply mathematical principles to problem-solving, construct truth tables, use proof methods, define graph theory elements, and demonstrate knowledge of discrete probability.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSCI235
', 'Database Systems', 'Database Systems, explores relational and semistructured databases, distributed database systems, concurrency control, and data recovery. Topics include conceptual modeling, SQL, PL/SQL, XQuery, XPath, normalization, and transaction management. Students learn to design, implement, and manage databases, covering principles of relational and semistructured models, distributed databases, and transaction management.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSCI203', 'Algorithms and Data Structures', ' Algorithms and Data Structures, reviews algorithm complexity analysis and emphasizes abstract data types in problem-solving. Students learn to compare algorithm complexities, choose appropriate data structures, use abstract data types, and develop reusable modules implementing algorithms..');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT314
','Software Development Methodologies', ' Software Development Methodologies, introduces modern software development methodologies, including software life cycle, process models, evolutionary models, Unified Process, UML, agile principles, DSDM, Scrum, extreme programming, test-driven development, CMMI, knowledge management, software architecture, and emerging trends. Students gain an in-depth understanding of software development stages, compare methodologies, apply practices and tools, work effectively in teams, and assess/improve software development processes.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSCI262','System Security', 'System Security, covers operating system security, database security, mobile code security, intrusion detection, security policies, and risk analysis. Students learn to analyze risks and threats, evaluate and manage security, understand security models in operating systems and databases, and provide security for mobile code systems.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSCI369  ', 'Ethical Hacking', 'This subject introduces the use of hacking skills for defensive purposes, developing critical thinking and troubleshooting skills. It aims to repurpose tools and resources for discovering new things, fostering creative thinking, and preparing students for ethical hacking certification. Students learn to utilize ethical hacking tools, conduct footprinting and reconnaissance, use sniffers and social engineering, understand malware in ethical hacking, and perform penetration testing to identify system weaknesses.');


INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSCI368', 'Network Security', 'This subjectprovides a survey of network security technologies, exploring network-based threats, security failures in network protocols, authentication servers, certificates, public-key infrastructures, security provisions in communication protocols and standards, and electronic mail security. Students learn to understand network vulnerabilities, design and analyze security protocols, use appropriate security standards and tools, and evaluate and recommend network security applications and systems.');

INSERT INTO all_subjects (SubjectCode, SubjectName, SubjectOutline) VALUES ('CSIT302 ', 'Cybersecurity', 'It introduces students to the global issue of cybersecurity, covering topics such as cyber threats, mobile security threats, malware, cloud security, security testing, digital forensics, cybercrime, and trusted computing. Students learn to identify and describe cybersecurity issues, explain principles and concepts underlying cybersecurity, demonstrate an understanding of cybersecurity-related issues, and describe and analyze solutions for preventing and responding to cybersecurity issues.');