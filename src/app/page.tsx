

import Fordele from "@/components/Fordele";
import ForsideHero from "@/components/Forside";
import Kategorier from "@/components/Kategorier";
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
        <ForsideHero   />
        <Fordele />
        <Kategorier />
    </Box>
  );
}
