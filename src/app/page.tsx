

import ForsideHero from "@/components/Forside";
// import NavMenu from "@/components/NavMenu";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box 
      sx={{
        height: "100vh", 
        backgroundImage: `url(/hero.jpg)`,
        backgroundSize: "cover",         
        backgroundPosition: "center",     
      }}>
        {/* <NavMenu /> */}
        <ForsideHero   />
    </Box>
  );
}
