#set up
1. npm i
2. npm run start
# api 
1.find all user
exemple: http://localhost:5000/api/users/
2.search is param (email,username,phone,v.v....)
exemple: http://localhost:5000/api/users/search?username=admin2
3.Create User
exemple http://localhost:5000/api/users
json 
{
    "name": "Admin1",
    "username": "admin1",
    "email": "admin2@example.com",
    "password": "admin123",
    "phone": "0888888889",
    "avatar": "https://example.com/avatar.jpg",
    "status": "active",
    "role": "admin"
  }

4.get user by id 
http://localhost:5000/api/users/684c405c9a738a5f0edea7b5
5.update infomation user
http://localhost:5000/api/users/684c405c9a738a5f0edea7b5
{
  "name": "kevin tien",
  "email": "updated@example.com",
  "password":"hihihi",
  "isDeleted": true
}
5 soft delete 
http://localhost:5000/api/users/684c405c9a738a5f0edea7b5/delete
