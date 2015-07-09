# Tổ Cú API
Tổng hợp toàn bộ API tương tác với dữ liệu `api.tocu.vn` & kèm theo tài liệu.

## Những nền tảng & package chính sử dụng

- NodeJS
- ExpressJS
- PostgreSQL
- Sequelize
- PassportJS


## APIs
- [User](/docs/User.md)
- [Box](/docs/Box.md)
- [Product](/docs/Product.md)
- [Like](/docs/Like.md)
- [District](/docs/District.md)
- [Model](/docs/Model.md)

## Response Codes
| Code | Name | Description |
| --- | --- | --- |
| `200` | Ok | The request was successful.
| `201` | Created | The resource was successfully created.
| `204` | No Content | The request was successful, but we did not send any content back.
| `400` | Bad Request | The request failed due to an application error, such as a validation error.
| `401` | Unauthorized | An API key was either not sent or invalid.
| `403` | Forbidden | The resource does not belong to the authenticated user and is forbidden.
| `404` | Not Found | The resource was not found.
| `500` | Server Error | A server error occurred.




## Validation Error
Khi POST request của bạn không đáp ứng đúng yêu cầu dữ liệu của hệ thống, response error sẽ có định dạng như bên dưới.

    {
      "message": "User validation failed",
      "name": "ValidationError",
      "errors": {
        "mobilePhone": {
          "properties": {
            "type": "required",
            "message": "Path `{PATH}` is required.",
            "path": "mobilePhone"
          },
          "message": "Path `mobilePhone` is required.",
          "name": "ValidatorError",
          "kind": "required",
          "path": "mobilePhone"
        }
      }
    }
