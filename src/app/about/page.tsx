

import AboutHero from "@/components/about/AboutHero";
import OurCompany from "@/components/about/OurCompany";
import OurMission from "@/components/about/OurMission";
import OurTeam from "@/components/about/OurTeam";
import WhyUs from "@/components/about/WhyUs";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box 
        sx={{ 
            // background: "white", 
            // color: "black", 
            // paddingBottom: "7rem",
            // width: "100%", 
            // backgroundImage: `url(/hero.jpg)`,
            // backgroundSize: "cover",         
            // backgroundPosition: "center", 
        }}
        >
        <img 
            src="/hero.jpg" 
            alt="hero" 
            style={{
                width: "100%",
                filter: "brightness(0.5)"
            }}
        />
        <AboutHero />
        <Box 
            sx={{ 
                display: "grid", 
                gap: "3rem", 
                padding: "0rem 2rem 2rem 2rem", 
                color: "black",
                marginTop: "-2rem"
            }}>
            <OurCompany />
            {/* <Divider sx={{ background: "grey", width: "80%", margin: "auto" }} /> */}
            <OurMission />  
            {/* <Divider sx={{ background: "grey", width: "80%", margin: "auto" }} /> */}
            <WhyUs />  
            {/* <Divider sx={{ background: "grey", width: "80%", margin: "auto" }} /> */}
            <OurTeam />  
        </Box>
    </Box>
  );
}
