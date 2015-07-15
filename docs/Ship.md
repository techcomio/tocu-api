Tính toán chi phí Ship
=====================

    GET http://api-dev.tocu.vn/ship?city=Hà Nội&district=Ba Vì&weight=500

Fields
--------------------
| Name | Type | Description |
| --- | --- | --- | --- |
| `city` | String | Tên Tỉnh thành phố |
| `district` | String | Tên Quận huyện |
| `weight` | Integer | Cân nặng của đơn hàng cần ship. Tính bằng `gram` |

Response
-----------------

    {
      "cost": 20000,
      "shippingMethod": "CPN Viettel"
    }