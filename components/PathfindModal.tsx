import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PathfindModalProps{
  open:boolean;
  startLocation:string|null;
  setOpen: (state:boolean) => void;
}
import "./Modal.css"
import {Dispatch, SetStateAction} from "react";

const PathfindModal = (props:PathfindModalProps) =>{
  return(
    <div className ="modalWrapper">
      <Dialog open={props.open} onOpenChange={() => props.setOpen(!props.open )} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className = "dialogHeaderText">New Trip</DialogTitle>
            <DialogDescription className="dialogSubtext">
              Enter the Start and End locations:
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PathfindModal;