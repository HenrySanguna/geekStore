// import { Popover, List, Button, Badge } from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
// import { useHistory } from "react-router-dom";

// export const Articles = ({ productsSel }) => {
//   const history = useHistory();

//   return (
//     <Popover
//       placement="bottom"
//       content={
//         <div style={{ width: 300 }}>
//           <div><b>Seleccionados</b></div>
//           <List
//             dataSource={productsSel}
//             style={{ maxHeight: 300, overflowY: "auto" }}
//             renderItem={(item, index) => (
//               <List.Item>
//                 <div>
//                   <div style={{ display: 'flex' }}>
//                     <span><b>{item.nombre}</b></span>
//                     <span style={{ paddingLeft: 5 }}>{`${item.cantidad} x $${item.precio_total} (Sin iva)`}</span>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         display: 'flex',
//                         flexDirection: 'row',
//                         justifyItems: 'center',
//                       }}
//                     >
//                       {item.description}
//                     </div>
//                   </div>
//                 </div>
//               </List.Item>
//             )}
//           >
//             <Button 
//               type='primary'
//               onClick={() => {
//                 history.push({
//                   pathname: "/cart",
//                   state: { productsSel }
//                 });
//               }}>Ir al carrito</Button>
//           </List>
//         </div>
//       }
//     >
//       <Button type="link" size="large" style={{ color: "#000" }}>
//         <Badge count={productsSel ? productsSel.length : 0}>
//           <ShoppingCartOutlined
//             style={{ fontSize: "30px" }}
//           ></ShoppingCartOutlined>
//         </Badge>
//       </Button>
//     </Popover>
//   );
// };

