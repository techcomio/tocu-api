
Tables
--------------
- Orders
- Orderlines
- Orderpayments

Orders table
--------------

Field | Type | Description | Note
------- | ------- | ------- | ----------
store | `ENUM` |  Chọn một trong các store `['ol', 'hqv', 'mk']`
UserId | `INTEGER` | ID của User (khách hàng)
shippingInfo | `JSONB` |
shippingMethod | `ENUM` | `['at store', 'COD', 'delivery']`
shippingCost | `INTEGER` | Phí ship
paymentMethod | `ENUM` | Cách thức thanh toán `['cash', 'card', 'transfer']`
status | `ENUM` | `['open', 'processing', 'pending', 'partialPaid', 'paid', 'sending', 'completed', 'failed', 'canceled']` | Default: `Open`
total | `INTEGER` | Tổng tiền trước giảm giá
percentageDiscount | `INTEGER` | Giảm giá phần trăm
fixedDiscount | `INTEGER` | Giảm giá tuyệt đối
amount | `INTEGER` | Tổng tiền sau giảm giá
totalWeight | `INTEGER` | Tổng khối lượng đơn hàng
noteBySaleman  | `TEXT` | Ghi chú bởi người bán hàng
createdBy | `JSONB` | 
updatedBy | `JSONB` |


### Order status

Status | Name | Description
------- | -------- | ----------
`Open` | Đã đặt hàng | Đơn hàng đã tạo, shop chưa xác nhận
`Processing` | Chờ chuyển hàng & thanh toán | Đã xác nhận đơn hàng. Áp dụng cho COD.
`Pending` | Chờ thanh toán | Đã xác nhận đơn hàng. Chờ KH thanh toán.
`Partial Paid` | Đã thanh toán một phần | -
`Paid` | Đã thanh toán | Xác nhận đã nhận được thanh toán. Chờ ship.
`Sending` | Đã gửi hàng | Hàng đã được đóng gói và chuyển cho bên CPN.
`Completed` | Hoàn thành | Thanh toán và giao hàng xong, khách hàng đã xác nhận, không còn yêu cầu gì thêm.
`Failed` | Thất bại | Thanh toán chưa thành công.
`Canceled` | Huỷ | Admin hoặc khách hàng tự huỷ đơn hàng.


### shippingInfo Object
```
{
	"name": "Trần Đức Hiếu",
	"phone": "0904906903",
	"company": "Techcom",
	"address": "P804, CT2A, KĐT Nghĩa Đô, ngõ 106 Hoàng Quốc Việt",
	"district": "Cầu Giấy",
	"city": "Hà Nội"
}
```

### createdBy Object
```
{
	"id": 1
	"name": "Trần Đức Hiếu",
	"avatarUrl": "..."
}
```

Orderlines table
----------------------
Field | Type | Description | Note
------- | -------- | --------- | ----------
OrderId | `INTEGER` | ID của Order
UserId | `INTEGER` | ID của User (người mua hàng)
product | `JSONB` | Product Object
unitPrice | `INTEGER` | Giá sản phẩm tính vào hóa đơn
quantity | `INTEGER` | Số lượng sản phẩm
amount | `INTEGER` | Thành tiền
status | `ENUM` | `['open', 'suspended', 'processing', 'completed', 'failed', 'canceled']` | Default: `open`


### Orderline status

Status | Description
------- | --------------
`open` | Sản phẩm được đặt hàng nhưng trong thời gian chờ thanh toán. User khác vẫn được đặt hàng sản phẩm này.
`suspended` | Đang treo chờ người đặt hàng trước (orderline `Open`)
`processing` | Người bán hàng đã nhận được chuyển khoản & xác nhận, chờ chuyển hàng. Các orderline khác đặt cùng sản phẩm sẽ chuyển sang status `Failed`
`completed` | Line & order đã chuyển hàng xong
`failed` | Đặt hàng thất bại do không chuyển tiền trong vòng 12h
`canceled` | Người bán hàng click hủy orderline


### product object
```
{
	"id": "1",
	"name": "Chân váy",
	"onlineStore": true,
	"code": "CV1",
	"image": "..."
}
```
Orderpayments table
-------------------------

Field | Type | Description | Note
------- | -------- | --------- | ----------
OrderId | `INTEGER` | ID của Order
amount | `INTEGER` | Số tiền
cashier | `JSONB` | Người thu tiền


POST params
-----------------------------
```
   {
	"store": "ol",
	"shippingInfo": {
	    "name": "Trần Đức Hiếu",
	    "phone": "0904906903",
	    "company": "Techcom",
	    "address": "P804, CT2A, KĐT Nghĩa Đô, ngõ 106 Hoàng Quốc Việt",
	    "district": "Cầu Giấy",
	    "city": "Hà Nội"
	},
	"shippingMethod": "delivery",
	"shippingCost": 20000,
	"paymentMethod": "transfer",
	"status": "open",
	"total": 400000,
	"percentageDiscount": 0,
	"fixedDiscount": 0,
	"amount": 420000,
	"totalWeight": 500,
	"noteBySaleman": "Noteeeee",
	"OrderLines": [{
		"product": {
			"id": 1,
			"onlineStore": true,
			"name": "Chân váy",
			"code": "CV1",
			"imageUrl": "http://tocu-api-dev-tranduchieu.c9.io/image/2015/07/b6208c164ecb7ee4db81-7-4.jpg"
		},
		"unitPrice": 200000,
		"quantity": 1,
		"amount": 200000,
		"status": "open" 
	}]
}
```

New OrderLine params
----------------------------

```
{
	"OrderId": 1,
	"product": {
		"id": 1,
		"onlineStore": true,
		"name": "Chân váy",
		"code": "CV1",
		"imageUrl": "http://tocu-api-dev-tranduchieu.c9.io/image/2015/07/b6208c164ecb7ee4db81-7-4.jpg"
	},
	"unitPrice": 200000,
	"quantity": 1,
	"amount": 200000
}
```
