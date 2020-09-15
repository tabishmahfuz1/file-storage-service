# file-storage-service
File Storage Service for Major Project

# APIs
## POST: file-upload
**ContentType:** multipart-formdata

**Params:**

    - file: mutipart File
    
    - name?: string
    
    - directory?: string
    
    - labels: JSON Array (String)
    
    - mimetype: String

## POST: search
**ContentType:** application/json

**Params:**

    - labels: Array<String>

## GET: /get/:id
**Params:** *id* **NOTE**: This is a URL parameter

**Description:** *Returns the file specified by the id*
