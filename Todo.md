## 📸 Image Upload to AWS S3 (Node.js + Multer + MemoryStorage)

### Upload Flow

- [✓] Post a photo with `multipart/form-data`
- [✓] Use **Multer** to upload image
- [✓] Use **memoryStorage** to store image as buffer (Don't store image on disk)
- [✓] AWS IAM User Setup: Add policy for S3 bucket (Read [Get], Write [Put, Delete])

---

### 🗑️ Delete Flow

- Find document by ID
- Delete image from S3
- Delete record from database

✅ (All steps done)

---

### ☁️ AWS - S3 Integration

To access AWS S3, we need **IAM (Identity and Access Management)** users to log in to the AWS account.

To perform actions like **put**, **get**, and **delete** files (e.g., images/videos), follow these steps:

---

### Step 1: Create a Policy

1. **Service**: Select **S3**.
2. **Actions**:
    - Read → `GetObject`
    - Write → `PutObject`, `DeleteObject`
3. **Resources**:
    - Choose **Specific** → Add ARNs:
      - **Resource Bucket Name**: `example-bucket-name`
      - **Resource Object Name**: `*` (for any object)

---

### Step 2: Review & Create Policy

- **Policy Name**: `insta-s3-bucket-access`
- Click **Create Policy**.
- Go to **Policies** → Search for `insta-s3`.
- Attach it to the IAM user later.

---

### Step 3: Create a User

1. Navigate to **Users** → **Create New User**.
    - **User Name**: `example-user-name`
    - **User Type**: Select **Programmatic Access** (access through Access Keys).  
    Example: `aashif-s3@123 (CP)` → Click **Next**.
2. **Permission Options**:
    - Attach the policy directly → Select `insta-s3-bucket-access`.
    - Skip adding tags.
    - Click **Create User**.

---

### Step 4: Configure IAM for Access Keys

1. Go to **IAM Console** → Select the new user (`insta-s3` user).
2. Create **Access Key**:
    - Choose: "Application running on AWS (e.g., Compute Services)" option.
3. Copy the **Access Key ID** and **Secret Access Key**.
4. Paste them into your application's `.env` file.

---

### ✅ Now your Node.js app can upload and delete images from AWS S3 securely!
