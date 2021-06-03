## Toll Plaza App

#### Setup config file
Path: `./config/default.json5`
```json
{
    PORT: 5000,
    DB_URL: 'Mongodb URI'
}
```
#### Install dependencies
```shell
 npm i 
````

### Run test
```shell
npm run test
```

#### Run application
```shell
npm run start
```

## APIs

1. To generate Receipt
   * `POST - /api/receipt/generate`

   * `Request params` : 
     1. `registrationNumber`: Alphanum string, Vehicle registration number (mandate)
     2. `isReturnable`: Boolean, true if vehicle is returning else false (mandate) 
     3. `direction`: Boolean, true if vehicle is coming else false (mandate)

    _Example_
    __Request:__
   ```http
   POST /api/receipt/generate HTTP/1.1
   Host: localhost:5000
   Content-Type: application/json

   {
    "registrationNumber": "RJ27CE1223",
    "isReturnable": true,
    "direction": false
    }
    ```

    __Response:__
    ```json
    {
    "status": 1,
    "data": {
        "isReturnable": true,
        "_id": "60b7460ecba8ee4b6d114026",
        "registrationNumber": "RJ27CE1223",
        "fee": 200,
        "direction": false,
        "createdOn": "2021-06-02T08:49:18.749Z",
        "__v": 0
        }
    }
    ```


### Future updates
1. Multiple toll plaza handling
1. User based access to portal
1. Direction button should be asked once instead of asking again n again
1. Multi-tenant architecture