import { Dialog } from "@mui/material";
import { themeContext } from "../App.js";
import { useContext, useState} from "react";
import GavelIcon from '@mui/icons-material/Gavel';

const Rules = () => {
  let { theme } = useContext(themeContext);
  let [open, setOpen] = useState(false);
  return (
    <div className="opendiv">
      <div
        className="openbtn"
        onClick={() => setOpen(true)}
        style={{
          color: theme.setTextColor,
        }}
      >
        Rules
      </div>
      <span className='rules-span'></span>
      <Dialog  open={open} onClose={() =>setOpen(false)} className="drules">
        <div
          className="rules-div"
          style={{ backgroundColor: theme.setBg, color: theme.setTextColor }}
        >
          <ul>
            <li key="1">Don't be rude.</li>
            <li key="2">
              Spamming in title, or description, or posting an explicit image
              for your article is prohibited and will result in a ban
            </li>
            <li key="3">
              Article title need to be meaningful and article description and image need
              to describe,explain, or elaborate the title
            </li>
            <li key="4">
              Every Article has a tag, please attach the suitable tag for your
              article
            </li>
            <li key='6'>
              Tags are chosen and added by the admins.
            </li>

            <li key='7'>
              You can write a title between 20 characters to 60 characters
            </li>
            <li key='8'>
              Description need to be 4000 characters or more
            </li>
            <li key="5">
              Finally, this webiste is about sharing your experience in some
              topic, sharing a fact, or educating your audience.
            </li>
          
          </ul>
          <div class="more" style={{ fontWeight: "bold" }}>
            More features and rules are coming in the future.
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Rules;
