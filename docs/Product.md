# Product API

## Create a Product

    POST http://api-dev.tocu.vn/product
    
### Fields

| Name | Type | Description | Notes |
| --- | --- | --- | --- |
| `name` | String | Tên sản phẩm | required
| `description` | String | Mô tả sản phẩm | 
| `BoxId` | Integer | Box ID | required
| `status` | ENUM | Tình trạng sản phẩm. Một trong các giá trị `['Draft', 'Available', 'Suspended', 'Sold', 'Closed']` | Default is 'Available'
| `price` | Integer | Giá sản phẩm |
| `salePrice` | Integer | Giá sale (nếu có)
| `weight` | Integer | Khối lượng sản phẩm | 
| `ModelId` | Integer | Model ID |
| `images` | Array | Url ảnh sản phẩm |

### Example

    {
        "name": "Áo phông Nike",
        "description": "Nike chính hãng, 100% cotton. Siêu mát!!!",
        "BoxId": 3,
        "code": "AP1",
        "status": "Available",
        "price": 120000,
        "salePrice": null,
        "weight": 500,
        "ModelId": 1,
        "images": ["http://api-dev.tocu.vn/image/a0d4435a464dbe52e373-img_1815.jpg", "http://api-dev.tocu.vn/image/4dc4a5cd81e5cbe5f6da-img_1819.jpg", "http://api-dev.tocu.vn/image/1112fa8361cc3a51d5f5-img_1818.jpg" ]
        
    }

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
    
## Get a Product

    GET http://api-dev.tocu.vn/product/1
    
### Response

    {
      "id": 1,
      "name": "Chân váy trắng",
      "description": "test 2 tessttttt",
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
      },
      "Model": {
        "id": 1,
        "name": "Trần Thùy Dương",
        "height": 165,
        "weight": 50,
        "bust": 87,
        "waist": 67,
        "hip": 90,
        "createdAt": "2015-06-23T16:24:01.942Z",
        "updatedAt": "2015-06-23T16:24:01.942Z"
      },
      "likesCount": 1
    }    
    
- Nếu `code` trả về `null` thì hiển thị giá trị của `id`