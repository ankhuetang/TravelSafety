import { formLabelClasses } from "@mui/joy/FormLabel";

export const root = {
  "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
  "--Cover-width": "50vw", // must be `vw` only
  "--Form-maxWidth": "700px",
  "--Transition-duration": "0.4s", // set to `none` to disable transition
};

export const formSide = {
  top: 0,
  bottom: 0,
  left: 0,
  width:
    "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
  transition: "width var(--Transition-duration)",
  transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
  position: "relative",
  zIndex: 1,
  display: "sticky",
  justifyContent: "flex-end",
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(255 255 255 / 0.6)",
};

export const alertSide = {
  zIndex: 1,
  display: "flex",
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(255 255 255 / 0.6)",
  position: "fixed",
  right: 0,
  top: 0,
  bottom: 0,
  left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
  transition:
    "width var(--Transition-duration), left var(--Transition-duration) !important",
  transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
};

export const formContainer = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  width:
    "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
  maxWidth: "100%",
  px: 2,
};

export const form = {
  my: "auto",
  py: 2,
  pb: 5,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: 400,
  maxWidth: "100%",
  mx: "auto",
  borderRadius: "sm",
  "& form": {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  [`& .${formLabelClasses.asterisk}`]: {
    visibility: "hidden",
  },
};

export const imageSide = {
  height: "100%",
  position: "fixed",
  right: 0,
  top: 0,
  bottom: 0,
  left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
  transition:
    "background-image var(--Transition-duration), left var(--Transition-duration) !important",
  transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
  backgroundColor: "background.level1",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundImage:
    "url(https://images.unsplash.com/photo-1478860409698-8707f313ee8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4000&q=80)",
};
