import {createContext, useContext} from 'react';
import {Trip} from "@prisma/client";
//set the initial value of the context to be an empty list (prior to assignment)
interface TableContextType{
  data:Trip[],
  setData:(item:Trip[]) => void;
}
export const TableContext = createContext<TableContextType>({data:[], setData:() =>{}}); //provide the data and set data hooks
export const useTableContext = () =>{
  const data = useContext(TableContext);
  if (data === undefined){
    throw new Error("useTableContext is undefined! Set it to a value!");
  }
  return data;


}