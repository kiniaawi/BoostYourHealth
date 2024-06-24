import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserHome from "../../pages/logged/user/UserHome";
import AdminHome from "../../pages/logged/admin/skin/AdminHome";
import Skincare from "../../pages/logged/admin/skin/Skincare";
import Haircare from "../../pages/logged/admin/hair/Haircare";
import Prevention from "../../pages/logged/admin/prevention/Prevention";
import Supplementation from "../../pages/logged/admin/supplementation/Supplementation";
import Navbar from "./Navbar";
import BlankBar from "./BlankBar";
import "../../style.css";
import StepsSkincare from "../../pages/logged/admin/skin/StepsSkincare";
import OilCleaners from "../../pages/logged/admin/skin/OilCleaners";
import Sidebar from "./Sidebar";
import FoamCleansers from "../../pages/logged/admin/skin/FoamCleansers";
import Exfoliants from "../../pages/logged/admin/skin/Exfoliants";
import SkinTypes from "../../pages/logged/admin/skin/SkinTypes";
import Footer from "../unlogged/Footer";
import DealingSkinIssues from "../../pages/logged/admin/skin/DealingSkinIssues";
import DefSupplIssues from "../../pages/logged/admin/supplementation/DefSupplIssues";
import DefSupplBloodTests from "../../pages/logged/admin/supplementation/DefSupplBloodTests";
import DefSupplDealing from "../../pages/logged/admin/supplementation/DefSupplDealing";
import Toners from "../../pages/logged/admin/skin/Toners";
import Essences from "../../pages/logged/admin/skin/Essences";
import Serums from "../../pages/logged/admin/skin/Serums";
import Masks from "../../pages/logged/admin/skin/Masks";
import EyeCreams from "../../pages/logged/admin/skin/EyeCreams";
import Moisturizers from "../../pages/logged/admin/skin/Moisturizers";
import SPF from "../../pages/logged/admin/skin/SPF";
import StepsBodycare from "../../pages/logged/admin/skin/StepsBodycare";
import ShowerGels from "../../pages/logged/admin/skin/ShowerGels";
import BodyOils from "../../pages/logged/admin/skin/BodyOils";
import BodyExfoliants from "../../pages/logged/admin/skin/BodyExfoliants";
import BodyMoisturizers from "../../pages/logged/admin/skin/BodyMoisturizers";
import BodyActives from "../../pages/logged/admin/skin/BodyActives";
import HairTypes from "../../pages/logged/admin/hair/HairTypes";
import StepsHaircare from "../../pages/logged/admin/hair/StepsHaircare";
import DealingHairProblems from "../../pages/logged/admin/hair/DealingHairProblems";
import HairPeelings from "../../pages/logged/admin/hair/HairPeelings";
import Shampoos from "../../pages/logged/admin/hair/Shampoos";
import HairMasks from "../../pages/logged/admin/hair/HairMasks";
import HairConditioners from "../../pages/logged/admin/hair/HairConditioners";
import HairOils from "../../pages/logged/admin/hair/HairOils";
import HeatProtection from "../../pages/logged/admin/hair/HeatProtection";
import HairOilsProtection from "../../pages/logged/admin/hair/HairOilsProtection";
import HairSerums from "../../pages/logged/admin/hair/HairSerums";
import SupplDosage from "../../pages/logged/admin/supplementation/SupplDosage";
import Diseases from "../../pages/logged/admin/prevention/Diseases";
import Diets from "../../pages/logged/admin/prevention/Diets";
import Workouts from "../../pages/logged/admin/prevention/Workouts";
import DiseasesSymptoms from "../../pages/logged/admin/prevention/DiseasesSymptoms";
import DiseasesPrevention from "../../pages/logged/admin/prevention/DiseasesPrevention";
import UserSupplementation from "../../pages/logged/user/Supplementation/UserSupplementation";
import SkinSupplementation from "../../pages/logged/user/Supplementation/SkinSupplementation";
import HairNailsSupplementation from "../../pages/logged/user/Supplementation/HairNailsSupplementation";
import DigestiveSystemSupplementation from "../../pages/logged/user/Supplementation/DigestiveSystemSupplementation";
import FunctioningSupplementation from "../../pages/logged/user/Supplementation/FunctioningSupplementation";
import HairNailsSupplAdvice from "../../pages/logged/user/Supplementation/HairNailsSupplAdvice";
import DigestiveSystemSupplAdvice from "../../pages/logged/user/Supplementation/DigestiveSystemSupplAdvice";
import FunctioningSupplAdvice from "../../pages/logged/user/Supplementation/FunctioningSupplAdvice";
import SkinSupplAdvice from "../../pages/logged/user/Supplementation/SkinSupplAdvice";
import UserProfile from "../../pages/logged/user/profile/UserProfile";
import HistorySupplAdvices from "../../pages/logged/user/profile/HistorySupplAdvices";
import UserSkincare from "../../pages/logged/user/skincare/UserSkincare";
import UserFaceSkincare from "../../pages/logged/user/skincare/UserFaceSkincare";
import UserBodySkincare from "../../pages/logged/user/skincare/UserBodySkincare";
import FaceSkincareAdvice from "../../pages/logged/user/skincare/FaceSkincareAdvice";
import HistorySkincareFaceAdvice from "../../pages/logged/user/profile/HistorySkincareFaceAdvice";
import DealingBodySkinIssues from "../../pages/logged/admin/skin/DealingBodySkinIssues";
import BodySkincareAdvice from "../../pages/logged/user/skincare/BodySkincareAdvice";
import HistorySkincareBodyAdvice from "../../pages/logged/user/profile/HistorySkincareBodyAdvice";
import HairCreams from "../../pages/logged/admin/hair/HairCreams";
import UserHaircare from "../../pages/logged/user/haircare/UserHaircare";
import UserHaircareAdvice from "../../pages/logged/user/haircare/UserHaircareAdvice";
import HistoryHaircareAdvice from "../../pages/logged/user/profile/HistoryHaircareAdvice";
import DiseasesSupplementation from "../../pages/logged/admin/prevention/DiseasesSupplementation";
import UserPrevention from "../../pages/logged/user/prevention/UserPrevention";
import UserDiseases from "../../pages/logged/user/prevention/UserDiseases";
import UserDiseasesPrevention from "../../pages/logged/user/prevention/UserDiseasesPrevention";
import UserDiseasesAdvice from "../../pages/logged/user/prevention/UserDiseasesAdvice";
import HistoryDiseases from "../../pages/logged/user/profile/HistoryDiseases";
import UserDiseasesPreventionAdvice from "../../pages/logged/user/prevention/UserDiseasesPreventionAdvice";
import { useCookies } from "react-cookie";
import NotAuthorized from "./NotAuthorized";
import Loading from "./Loading";

const Feed = ({ currentContent, onChangeContent }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageContent",
    "nameCookie",
    "isAdminCookie",
  ]);

  const isAdmin = cookies.isAdminCookie;
  const userEmail = cookies.emailCookie;

  const [userData, setUserData] = useState([]);
  const [adminChecking, setAdminChecking] = useState("");

  console.log("IsAdminCookieNavbar: ", isAdmin);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    CheckIfIsAdmin();
  }, [userData]);

  const fetchUserData = () => {
    axios
      .get("/api/Registration")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setUserData(response.data.Data);
        CheckIfIsAdmin();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CheckIfIsAdmin = () => {
    if (userData.length > 0) {
      const currentUser = userData.find((user) => user.Email === userEmail);

      if (currentUser) {
        if (currentUser.IsAdmin) {
          console.log(currentUser.IsAdmin);
          setAdminChecking(true);
        } else {
          console.log(currentUser.IsAdmin);
          setAdminChecking(false);
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      sx={{ margin: 0, p: 0, height: "100vh" }}
      //overflow={"auto"}
    >
      <Navbar
        onChangeContent={onChangeContent}
        onSidebarToggle={handleSidebarToggle}
      />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ height: "100%", flexGrow: 1 }}
      >
        <BlankBar />
        <Box flex={8} p={1} justifyContent={"center"} overflow={"auto"}>
          <div>
            {isAdmin === 1 ||
            isAdmin === true ||
            adminChecking === 1 ||
            adminChecking === true ? (
              <>
                {currentContent === "admin-home" && (
                  <AdminHome onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-skincare" && (
                  <Skincare onChangeContent={onChangeContent} />
                )}
                {currentContent === "skincare-steps" && (
                  <StepsSkincare onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-skinissues" && (
                  <DealingSkinIssues onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-body-skinissues" && (
                  <DealingBodySkinIssues onChangeContent={onChangeContent} />
                )}
                {currentContent === "skin-types" && (
                  <SkinTypes onChangeContent={onChangeContent} />
                )}
                {currentContent === "oil-cleaners" && (
                  <OilCleaners onChangeContent={onChangeContent} />
                )}
                {currentContent === "foam-cleansers" && (
                  <FoamCleansers onChangeContent={onChangeContent} />
                )}
                {currentContent === "exfoliants" && (
                  <Exfoliants onChangeContent={onChangeContent} />
                )}
                {currentContent === "toners" && (
                  <Toners onChangeContent={onChangeContent} />
                )}
                {currentContent === "essences" && (
                  <Essences onChangeContent={onChangeContent} />
                )}
                {currentContent === "serums" && (
                  <Serums onChangeContent={onChangeContent} />
                )}
                {currentContent === "masks" && (
                  <Masks onChangeContent={onChangeContent} />
                )}
                {currentContent === "eye-creams" && (
                  <EyeCreams onChangeContent={onChangeContent} />
                )}
                {currentContent === "moisturizers" && (
                  <Moisturizers onChangeContent={onChangeContent} />
                )}
                {currentContent === "spf" && (
                  <SPF onChangeContent={onChangeContent} />
                )}
                {currentContent === "steps-bodycare" && (
                  <StepsBodycare onChangeContent={onChangeContent} />
                )}
                {currentContent === "shower-gels" && (
                  <ShowerGels onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-oils" && (
                  <BodyOils onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-exfoliants" && (
                  <BodyExfoliants onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-moisturizers" && (
                  <BodyMoisturizers onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-actives" && (
                  <BodyActives onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-haircare" && (
                  <Haircare onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-types" && (
                  <HairTypes onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-hairproblems" && (
                  <DealingHairProblems onChangeContent={onChangeContent} />
                )}
                {currentContent === "haircare-steps" && (
                  <StepsHaircare onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-peelings" && (
                  <HairPeelings onChangeContent={onChangeContent} />
                )}
                {currentContent === "shampoos" && (
                  <Shampoos onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-masks" && (
                  <HairMasks onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-conditioners" && (
                  <HairConditioners onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-oils" && (
                  <HairOils onChangeContent={onChangeContent} />
                )}
                {currentContent === "heat-protection" && (
                  <HeatProtection onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-oils-protection" && (
                  <HairOilsProtection onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-serums" && (
                  <HairSerums onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-creams" && (
                  <HairCreams onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-prevention" && (
                  <Prevention onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases" && (
                  <Diseases onChangeContent={onChangeContent} />
                )}
                {currentContent === "diets" && (
                  <Diets onChangeContent={onChangeContent} />
                )}
                {currentContent === "workouts" && (
                  <Workouts onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases-symptoms" && (
                  <DiseasesSymptoms onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases-supplementation" && (
                  <DiseasesSupplementation onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases-prevention" && (
                  <DiseasesPrevention onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-supplementation" && (
                  <Supplementation onChangeContent={onChangeContent} />
                )}
                {currentContent === "def-suppl-issues" && (
                  <DefSupplIssues onChangeContent={onChangeContent} />
                )}
                {currentContent === "def-suppl-tests" && (
                  <DefSupplBloodTests onChangeContent={onChangeContent} />
                )}
                {currentContent === "suppl-dosage" && (
                  <SupplDosage onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-def-suppl" && (
                  <DefSupplDealing onChangeContent={onChangeContent} />
                )}
              </>
            ) : (
              <>
                {currentContent === "admin-home" && (
                  <Loading onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-skincare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "skincare-steps" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-skinissues" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-body-skinissues" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "skin-types" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "oil-cleaners" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "foam-cleansers" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "exfoliants" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "toners" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "essences" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "serums" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "masks" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "eye-creams" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "moisturizers" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "spf" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "steps-bodycare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "shower-gels" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-oils" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-exfoliants" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-moisturizers" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-actives" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-haircare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-types" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-hairproblems" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "haircare-steps" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-peelings" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "shampoos" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-masks" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-conditioners" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-oils" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "heat-protection" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-oils-protection" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-serums" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-creams" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-prevention" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "diets" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "workouts" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases-symptoms" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "diseases-prevention" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "admin-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "def-suppl-issues" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "def-suppl-tests" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "suppl-dosage" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "dealing-def-suppl" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
              </>
            )}

            {isAdmin === 0 ||
            isAdmin === false ||
            adminChecking === 0 ||
            adminChecking === false ? (
              <>
                {currentContent === "homepage" && (
                  <UserHome onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-supplementation" && (
                  <UserSupplementation onChangeContent={onChangeContent} />
                )}
                {currentContent === "skin-supplementation" && (
                  <SkinSupplementation onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-nails-supplementation" && (
                  <HairNailsSupplementation onChangeContent={onChangeContent} />
                )}
                {currentContent === "digestive-system-supplementation" && (
                  <DigestiveSystemSupplementation
                    onChangeContent={onChangeContent}
                  />
                )}
                {currentContent === "skin-suppl-advice" && (
                  <SkinSupplAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-nails-suppl-advice" && (
                  <HairNailsSupplAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "digestive-system-suppl-advice" && (
                  <DigestiveSystemSupplAdvice
                    onChangeContent={onChangeContent}
                  />
                )}
                {currentContent === "functioning-supplementation" && (
                  <FunctioningSupplementation
                    onChangeContent={onChangeContent}
                  />
                )}
                {currentContent === "functioning-suppl-advice" && (
                  <FunctioningSupplAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-profile" && (
                  <UserProfile onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-supplementation-advices" && (
                  <HistorySupplAdvices onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-skincare" && (
                  <UserSkincare onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-face-skincare" && (
                  <UserFaceSkincare onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-body-skincare" && (
                  <UserBodySkincare onChangeContent={onChangeContent} />
                )}
                {currentContent === "face-skincare-advice" && (
                  <FaceSkincareAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-skincare-advice" && (
                  <BodySkincareAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-skincare-face-advices" && (
                  <HistorySkincareFaceAdvice
                    onChangeContent={onChangeContent}
                  />
                )}
                {currentContent === "history-skincare-body-advices" && (
                  <HistorySkincareBodyAdvice
                    onChangeContent={onChangeContent}
                  />
                )}
                {currentContent === "user-haircare" && (
                  <UserHaircare onChangeContent={onChangeContent} />
                )}
                {currentContent === "haircare-advice" && (
                  <UserHaircareAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-haircare-advice" && (
                  <HistoryHaircareAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-prevention" && (
                  <UserPrevention onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases" && (
                  <UserDiseases onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases-prevention" && (
                  <UserDiseasesPrevention onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases-advice" && (
                  <UserDiseasesAdvice onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases-prevention-advice" && (
                  <UserDiseasesPreventionAdvice
                    onChangeContent={onChangeContent}
                  />
                )}
                {currentContent === "history-diseases" && (
                  <HistoryDiseases onChangeContent={onChangeContent} />
                )}
              </>
            ) : (
              <>
                {currentContent === "homepage" && (
                  <Loading onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "skin-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-nails-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "digestive-system-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "skin-suppl-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "hair-nails-suppl-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "digestive-system-suppl-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "functioning-supplementation" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "functioning-suppl-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-profile" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-supplementation-advices" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-skincare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-face-skincare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-body-skincare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "face-skincare-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "body-skincare-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-skincare-face-advices" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-skincare-body-advices" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-haircare" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "haircare-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-haircare-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-prevention" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases-prevention" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "user-diseases-prevention-advice" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
                {currentContent === "history-diseases" && (
                  <NotAuthorized onChangeContent={onChangeContent} />
                )}
              </>
            )}
          </div>
        </Box>
        <BlankBar />
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <Sidebar
            isOpen={sidebarOpen}
            onChangeContent={onChangeContent}
            onClose={handleSidebarToggle}
            adminChecking={adminChecking}
          />
        </div>
      </Stack>
      <Footer />
    </Box>
  );
};

export default Feed;
