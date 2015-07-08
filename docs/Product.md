# Product API

## Create a Product

## Count all Products
Đếm tất cả các sản phẩm đang có sẵn & public

    GET http://api-dev.tocu.vn/product/count

### Response

    2

## Find Products by Box

    GET http://api-dev.tocu.vn/product/box/1?skip=0&limit=1
    

### Response

    [
      {
        "id": 1,
        "name": "Chân váy trắng",
        "description": "tessttttt",
        "BoxId": 1,
        "code": "CV1",
        "status": "Available",
        "price": 220000,
        "salePrice": null,
        "weight": 500,
        "ModelId": 1,
        "images": [
          "http://tocu-api-dev-tranduchieu.c9.io/image/108ea2d4ea3c93ab0bd9-img_1121.JPG",
          "http://tocu-api-dev-tranduchieu.c9.io/image/3acb8930ee56e18b16e1-img_0804.JPG"
        ],
        "createdAt": "2015-06-24T14:36:32.456Z",
        "updatedAt": "2015-06-24T14:36:32.456Z"
      }
    ]
    

## Find all Products

    GET http://api-dev.tocu.vn/product?skip=0&limit=1
    
### Response

    [
      {
        "id": 1,
        "name": "Chân váy trắng",
        "description": "tessttttt",
        "BoxId": 1,
        "code": "CV1",
        "status": "Available",
        "price": 220000,
        "salePrice": null,
        "weight": 500,
        "ModelId": 1,
        "images": [
          "http://tocu-api-dev-tranduchieu.c9.io/image/108ea2d4ea3c93ab0bd9-img_1121.JPG",
          "http://tocu-api-dev-tranduchieu.c9.io/image/3acb8930ee56e18b16e1-img_0804.JPG"
        ],
        "createdAt": "2015-06-24T14:36:32.456Z",
        "updatedAt": "2015-06-24T14:36:32.456Z",
        "Box": {
          "id": 1,
          "name": "Chân váy",
          "type": "product",
          "description": null,
          "createdAt": "2015-06-24T14:08:43.548Z",
          "updatedAt": "2015-06-24T14:08:43.548Z"
        }
      }
    ]