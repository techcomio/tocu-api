# Like
API post & get số người Like Box, Sản phẩm, Bài viết, Ảnh

## Create a Like
Tạo một Like

    POST http://tocu-api.herokuapp.com/like

### Fields
| Name | Type | Description |
| --- | --- | --- | --- |
| `type` | ENUM | Dạng item. `['box', 'product', 'article', 'photo']` |
| `itemId` | Integer | Id của item |
| `UserId` | Integer | Id của User ấn Like |


### Example

    POST http://tocu-api.herokuapp.com/model

    {
        "type": "product",
        "itemId": 1,
        "UserId": 1
    }

### Response

    {
      "id": 1,
      "type": "product",
      "itemId": 1,
      "UserId": 1,
      "updatedAt": "2015-06-25T03:09:39.006Z",
      "createdAt": "2015-06-25T03:09:39.006Z"
    }
    

## Count Likes by Item ID


    GET http://tocu-api.herokuapp.com/like/:type/:id


### Example

    GET http://tocu-api.herokuapp.com/like/product/1


### Response

    1

