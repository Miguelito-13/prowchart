import ConcatenationOpFA from "./ConcatenationOpFA.js";
import MathematicalOpFA from "./MathematicalOpFA.js";

const validThirdToken = [
    "Number Constant",
    "Boolean Constant",
    "String Constant",
    "Identifier",
]


export default function AssignmentFA(tokenizedText, flowgram){
    console.log("- AssignmentFA")
    
    let tokenizedClone = [...tokenizedText];
    let res = {
        groupedToken: {
            groupedTokens: [],
        },
        error: false,
    }

    let variableInfo = {}                                           //name: "", value: "", type: ""
    while(tokenizedClone.length > 0){

        //===========================================
        if (tokenizedClone[0] && tokenizedClone[0].Type === "Identifier"){                   //Check first token (~x~ = 1)
            variableInfo.name = tokenizedClone[0].Token
            res.groupedToken.groupedTokens.push(tokenizedClone[0])
            tokenizedClone.shift()    
        } else {         
            res.error = "ERROR: Invalid assignment syntax";
            return res;
        }
    
        //===========================================
        if (tokenizedClone[0] && tokenizedClone[0].Type === "Assign Operator"){             //Check second token (x ~=~ 1)
            res.groupedToken.groupedTokens.push(tokenizedClone[0])
            tokenizedClone.shift()
        } else {         
            res.error = "ERROR: Invalid assignment syntax";
            return res;
        }
    
        //===========================================
        if (tokenizedClone[0] && validThirdToken.includes(tokenizedClone[0].Type) && tokenizedClone.length == 1){          //Check third token (x = ~1~)
            if (tokenizedClone[0].Type === "Identifier"){
                const existingVar = flowgram.getVariable(tokenizedClone[0].Token);
                if(!existingVar){
                    res.error = "ERROR: Undefined variable '" + tokenizedClone[0].Token + "'"
                    return res;
                }
    
                variableInfo.value = existingVar.value;
                variableInfo.type = existingVar.type;
            } else {
                variableInfo.value = tokenizedClone[0].Token;
                variableInfo.type = tokenizedClone[0].Type;
            }
            res.groupedToken.groupedTokens.push(tokenizedClone[0])
            tokenizedClone.shift()
    
        //===========================================
        } else {
            const result = MathematicalOpFA(tokenizedClone, true);            //Check rest of the tokens (x = ~1 + 1~)
            if (result.error){
                result = ConcatenationOpFA(tokenizedClone, true);            //Check rest of the tokens (x = ~"Hello" , "Hi"~)
                if (result.error){
                    res.error = "ERROR: Invalid assignment syntax";
                    return res;
                } else {
                    variableInfo.value = result.groupedToken.groupedTokens;
                    variableInfo.type = result.groupedToken.groupedTokensType;
                    res.groupedToken.groupedTokens.push(result.groupedToken)
                    tokenizedClone = result.remainingTokens;
                } 
            } else {
                variableInfo.value = result.groupedToken.groupedTokens;
                variableInfo.type = result.groupedToken.groupedTokensType;
                res.groupedToken.groupedTokens.push(result.groupedToken)
                tokenizedClone = result.remainingTokens;
            }
        }

        if(variableInfo.name && variableInfo.value && variableInfo.type){

            const existingVariable = flowgram.getVariable(variableInfo.name);
            console.log("Variable Info:", variableInfo);
            if(existingVariable){
                flowgram.updateVariable(variableInfo.name, variableInfo.value, variableInfo.type)
            } else {
                flowgram.addVariable(variableInfo.name, variableInfo.value, variableInfo.type)
            }

            variableInfo = {};
        }
    }

    //===========================================
    if (tokenizedClone.length > 0){
        res.error = "ERROR: Invalid assignment syntax";
        return res;
    } else {
        res.groupedToken = {
            groupedTokensType: "Assignment"
        };

        return res;
    }

}