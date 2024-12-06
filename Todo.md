1. Post a photo with multipart/form-data [✓]
2. Use Multer to upload image [✓]
3. Use memoryStorage to store image as buffer.(don't store image on disk) [✓]
4. Create IAM user. add policy for s3 bucket - Read[Get] - Write[Put, Delete] [✓] 

Delete 
Find id
Delete from s3
Delete from database

[✓] - Done 

AWS - S3
To access AWS S3, we need IAM (Identity and Access Management) users to log in to the AWS account. To perform actions like put, get, and delete files (e.g., images/videos), follow these steps:
Step 1: Create a Policy
	1.	Select S3 (Service)
	2.	Actions:
	•	Read → GetObject
	•	Write → PutObject & DeleteObject
	3.	Resources:
	•	Choose Specific → Add ARNs.
	•	Resource Bucket Name: example-bucket-name
	•	Resource Object Name: * (for any object)
Next:
Step 2: Review & Create
	•	Policy Name: insta-s3-bucket-access
	•	Click Create Policy.
Go to Policy → Search for insta-s3.
	•	It will appear at the top.
	•	Add it to the list of policies.
Step 2: Create a User
	1.	Navigate to Users → Create New User.
	•	User Name: example-user-name
	•	User Type: Specify the user in the identity console → Select Programmatic Access (access through Access Keys).
Example: aashif-s3@123(CP) → Click Next.
	2.	Permission Options:
	•	Attach the policy directly → Choose insta-s3-bucket-access.
	•	Click Next (no need to add tags).
	•	Click Create User.
Step 3: Configure IAM
	1.	Navigate to IAM → Go to insta-s3.
	•	Create Access Key → Use Access Key Best Practices and alternatives.
	•	Application running on AWS (e.g., Compute Services).
	2.	Copy the Access Key and paste it into the .env file of your application.