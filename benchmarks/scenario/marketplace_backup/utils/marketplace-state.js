/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Class for managing marketplace states.
 */
class MarketplaceState {

    /**
     * Initializes the instance.
     */
    constructor(workerIndex, initialMoney, accounts = 0) {
        this.accountsGenerated = accounts;
        this.initialMoney = initialMoney;
        this.accountPrefix = this._get26Num(workerIndex);
    }

    /**
     * Generate string by picking characters from the dictionary variable.
     * @param {number} number Character to select.
     * @returns {string} string Generated string based on the input number.
     * @private
     */
    _get26Num(number){
        let result = '';

        while(number > 0) {
            result += Dictionary.charAt(number % Dictionary.length);
            number = parseInt(number / Dictionary.length);
        }

        return result;
    }

    /**
     * Construct an account key from its index.
     * @param {number} index The account index.
     * @return {string} The account key.
     * @private
     */
    _getAccountKey(index) {
        return this.accountPrefix + this._get26Num(index);
    }

    /**
     * Returns a random account key.
     * @return {string} Account key.
     * @private
     */
    _getRandomAccount() {
        // choose a random TX/account index based on the existing range, and restore the account name from the fragments
        const index = Math.ceil(Math.random() * this.accountsGenerated);
        return this._getAccountKey(index);
    }

    /**
     * Returns a random timestamp.
     * @return {string} Account key.
     * @private
     */
    _getRandomTime() {
	let timestamp = 0; 	
        timestamp = Math.round(Date.now() / 1000);
        return timestamp;
    }

    /**
     * Get the argument for creating random file hash (SHA-256)
     *
     */
    _getRandomFileHash() {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
 
    /**
     * Get the arguments for creating a new voting on design.
     * @returns {object} The announce arguments.
     */
    getAnnounceArguments() {
        this.accountsGenerated++;
        return {
            fileHash: this._getRandomFileHash(),
            timestamp: this._getRandomTime(),
            commitment: this.initialMoney,
            manager: this._getAccountKey(this.accountsGenerated),
            money: this.initialMoney
        };
    }

}

module.exports = MarketplaceState;
