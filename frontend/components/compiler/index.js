import { compileCandidateCode } from "@/method/compiler";
import axios from "axios";

const compileCode = async (language, script, stdin) => {
  return await compileCandidateCode( language, script, stdin );
};

export default compileCode;
