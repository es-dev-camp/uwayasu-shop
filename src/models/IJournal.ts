import Timestamp from "@/models/Timestamp";
import IItem from "@/models/IItem";
import IUser from "@/models/IUser";

export default interface IJournal {
  createdAt: Timestamp;
  item: IItem;
  user: IUser;
}
