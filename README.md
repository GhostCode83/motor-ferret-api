# Motor Ferret!
The Ultimate Motorsports Event Finder!

# Motor Ferret API
The Motor Ferret API is a RESTful API that uses standard HTTP verbs. 

## Technologies ##
- Node
- Express
- PostgreSQL 
- JavaScript ES6

## API Reference

### Auth

**URL**: `api/auth/login`

**Method**: `POST`

**Headers**: 
  `'content-type': 'application/json'`
  
**Body**
```json
{
  "username": "[username]",
  "password": "[password]"
}
```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNjExODc1MzEzLCJzdWIiOiJSYW5keSJ9.qk7W1CnO7pZN8BMBI_t_IV1I_ah0onCmfeEaay--2OA",
  "userId": 47
}
```
---


### User

**URL**: `api/users/signup`

**Method**: `POST`

**Headers**: 
  `'content-type': 'application/json'`
  
**Body**
```json
{  
  "fullname": "[fullname]",
  "username": "[username]",
  "password": "[password]",
  "admin": "[No]"
}
```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
{
    "id": 97,
    "fullname": "Full Name, Sr.",
    "username": "Fully327",
    "date_created": "2021-01-28T23:36:38.541Z",
    "admin": "No"
}
```
---

**URL**: `api/users`

**Method**: `GET`

**Headers**: 
  ```json
  'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M',
  ```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
[
  {
  "id": 1,
  "fullname": "Alvin Alphonse",
  "username": "AlphonseAdvisor",
  "password": "$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm",
  "profile_picture": "[placeholder for user image",
  "flagged": "No",
  "admin": "No", 
  "blocked": "No"
    },
    {
  "id": 2,
  "fullname": "Oprah Bailey",
  "username": "BaileyBoxer",
  "password": "$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm",
  "profile_picture": "[placeholder for user image",
  "flagged": "No",
  "admin": "No", 
  "blocked": "No"
    },
    {
  "id": 3,
  "fullname": "Jeremy Jeremy",
  "username": "CalypsoClover",
  "password": "$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm",
  "profile_picture": "[placeholder for user image",
  "flagged": "Yes",
  "admin": "No", 
  "blocked": "Yes"
    }
]
```
---


**URL**: `api/users/:user_id`

**Method**: `GET`

**Headers**: 
  ```json
  'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M',
  ```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
[
  {
  "id": 1,
  "fullname": "Alvin Alphonse",
  "username": "AlphonseAdvisor",
  "password": "$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm",
  "profile_picture": "[placeholder for user image",
  "flagged": "No",
  "admin": "No", 
  "blocked": "No"
    }
]
```
---


**URL**: `api/users/admin/:user_id`

**Method**: `PATCH`

**Headers**: 
  ```json
  'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M',
  ```

### Success Response

**Code**: `204 No Content`

---


### Events

**URL**: `api/events`

**Method**: `GET`

**Headers**: 
  ```json
  'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M',
  ```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
[
  {
      "id": 1,
      "title": "Track Event",
      "date1": "2021-02-18T05:00:00.000Z",
      "date2": "2021-02-20T05:00:00.000Z",
      "date_created": "2020-01-18T05:00:00.000Z",
      "organizer": "John Doe",
      "website": "www.John-Doe-Racing.com",
      "address": "123 Street Street",
      "address2": "Suite 117",
      "event_description": "this is a test description",
      "event_type": "rallying",
      "city": "Largo",
      "state": "MD",
      "zip": "20774",
    },
    {
      "id": 2,
      "title": "Drag Race Event",
      "date1": "2021-08-18T05:00:00.000Z",
      "date2": "2021-08-20T05:00:00.000Z",
      "date_created": "2020-01-18T05:00:00.000Z",
      "organizer": "Simon Henderson",
      "website": "www.Henderson-Racing.com",
      "address": "8000 Baltimore Ave",
      "address2": "",
      "event_description": "this is an example description",
      "event_type": "drag_racing",
      "city": "College Park",
      "state": "MD",
      "zip": "20740",
    },
    {
      "id": 3,
      "title": "Happy Road Race",
      "date1": "2021-02-18T05:00:00.000Z",
      "date2": "2021-02-20T05:00:00.000Z",
      "date_created": "2020-01-18T05:00:00.000Z",
      "organizer": "Happy Motorsports",
      "website": "www.HappyMotorsports.com",
      "address": "787 Happy Street",
      "address2": "",
      "event_description": "this is an example description",
      "event_type": "road_racing",
      "city": "Ocean City",
      "state": "MD",
      "zip": "21842",
    }
]
```
---

**URL**: `api/events`

**Method**: `POST`

**Headers**: 

```json
'content-type': 'application/json',
'mode': 'cors',
'Access-Control-Allow-Origin': '*',
'authorization': 'bearer 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M'
```

**Body**
```json
{
       "title": "Drag Race Event",
      "date1": "2021-08-18T05:00:00.000Z",
      "date2": "2021-08-20T05:00:00.000Z",
      "date_created": "2020-01-18T05:00:00.000Z",
      "organizer": "Simon Henderson",
      "website": "www.Henderson-Racing.com",
      "address": "8000 Baltimore Ave",
      "address2": "",
      "event_description": "this is an example description",
      "event_type": "drag_racing",
      "city": "College Park",
      "state": "MD",
      "zip": "20740",
}
```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
{
    "id": 2,
      "title": "Drag Race Event",
      "date1": "2021-08-18T05:00:00.000Z",
      "date2": "2021-08-20T05:00:00.000Z",
      "date_created": "2020-01-18T05:00:00.000Z",
      "organizer": "Simon Henderson",
      "website": "www.Henderson-Racing.com",
      "address": "8000 Baltimore Ave",
      "address2": "",
      "event_description": "this is an example description",
      "event_type": "drag_racing",
      "city": "College Park",
      "state": "MD",
      "zip": "20740",
}
```
---

**URL**: `api/events/:events_id`

**Method**: `GET`

**Headers**: 
  ```json
  'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M',
```

### Success Response

**Code**: `200 OK`

**Body Response**

```json
{
      "id": 2,
      "title": "Drag Race Event",
      "date1": "2021-08-18T05:00:00.000Z",
      "date2": "2021-08-20T05:00:00.000Z",
      "date_created": "2020-01-18T05:00:00.000Z",
      "organizer": "Simon Henderson",
      "website": "www.Henderson-Racing.com",
      "address": "8000 Baltimore Ave",
      "address2": "",
      "event_description": "this is an example description",
      "event_type": "drag_racing",
      "city": "College Park",
      "state": "MD",
      "zip": "20740",
}
```
---

**URL**: `api/events/:events_id`

**Method**: `DELETE`

**Headers**: 

```json
'authorization': 'bearer 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MTE4Nzc3ODgsInN1YiI6IlJhbmR5In0.PC7gj3Ap3vu2IboR1EBSj78DeiK_1UH3UkHCL8a083M'
```

### Success Response

**Code**: `204 No Content`
