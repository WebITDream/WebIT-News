import mysql.connector
import smtplib

# Get all mails from database

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="webitnews"
)

mycursor = mydb.cursor()

mycursor.execute("SELECT email FROM users")

allEmails = []


myresult = mycursor.fetchall()
count = 0

for x in myresult:
    count += 1
    allEmails.append(x[0])


# print(allEmails)

print("Total addresses found: ", count)




# Send mail to all addresses

import smtplib

gmail_user = 'webitnews.newsletter@gmail.com'
gmail_password = 'exprulurgasppclt'

sent_from = gmail_user
to = allEmails
subject = 'WebIT News - Newsletter'
body = 'A venit vijiliile peste noi e greva de foame, vacanta de vara a fost scurtata, fmm campeanu'

email_text = """\
From: %s
To: %s
Subject: %s

%s
""" % (sent_from, ", ".join(to), subject, body)

try:
    smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    smtp_server.ehlo()
    smtp_server.login(gmail_user, gmail_password)
    smtp_server.sendmail(sent_from, to, email_text)
    smtp_server.close()
    print ("Email sent successfully!")
except Exception as ex:
    print ("Something went wrong….",ex)