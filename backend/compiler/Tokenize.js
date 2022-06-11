import Tokens from './Tokens.js';

/*
    result = {
        tokenized: [
            {
                Token: "text",
                Type: tokenType
            },
        ],
        error: string
    }
*/

export default function Tokenize(text){
    let token = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    let result = {
        tokenized: []
    }
    
    while(token.length > 0) {

        let valid = false;
        for (let j=0; j<Tokens.length; j++){

            const regex = Tokens[j].pattern
            const patternType = Tokens[j].type
            
            const res = regex.exec(token);
            if (res && res.index == 0){
                valid = true;

                if (patternType != 'Space'){
                    result.tokenized.push({
                        Token: res[0],
                        Type: patternType
                    })
                }

                token = token.replace(res[0], ''); 
                break;               
            }
        }

        if (!valid) {
            result.error = "Error: " + token + " cannot be tokenized.";
            return result;
        }
    }

    return result;
}