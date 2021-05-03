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

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

const Web3 = require('web3');

["0x2c2204d6238d430da677a44e3dd1153b234e7be3", "0x88b0823e86bdf97fcde3643ee720baf46b762f11befefc441cb4cc7d4e18d475", "0xa72f7fcca49e5a7d2bdc64e046a2049732b8435bab624ae856b312e4d8b2f25054f67144803f980f47fe48466185f66d3d2f8916511c996a05aaff2787d7c72f1c"]];

/**
 * Workload module for initializing the SUT with various accounts.
 */
class SimpleOpenWorkload extends WorkloadModuleBase {

    /**
     * Initializes the parameters of the workload.
     */
    constructor() {
        super();
        this.accountPrefix = '';
        this.txIndex = -1;
    }

    /**
     * Generate string by picking characters from the dictionary variable.
     * @param {number} number Character to select.
     * @returns {string} string Generated string based on the input number.
     * @private
     */
    static _get26Num(number){
        let result = '';

        while(number > 0) {
            result += Dictionary.charAt(number % Dictionary.length);
            number = parseInt(number / Dictionary.length);
        }

        return result;
    }

    /**
     * Generate unique account key for the transaction.
     * @returns {string} The account key.
     * @private
     */
    _generateAccount() {
        return this.roundArguments.accountPhasePrefix + this.accountPrefix + SimpleOpenWorkload._get26Num(this.txIndex + 1);
    }

    /**
     * Get the argument for creating random file hash (SHA-256)
     *
     */
    _getRandomFileHash(length) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    /**
     * Returns a random timestamp.
     * @return {string} Account key.
     * @private
     */
    _getRandomTime() {
        let timestamp = 0;
        timestamp = Math.round(Date.now() / 1000) + 1500;
        return timestamp;
    }

    /**
     * Generates simple workload.
     * @returns {{verb: String, args: Object[]}[]} Array of workload argument objects.
     */
    _generateWorkload() {
        let workload = [];
        for(let i= 0; i < this.roundArguments.txnPerBatch; i++) {
            this.txIndex++;

            workload.push({
                contract: 'marketplace',
                verb: 'calculateResult',
                args: [this.txIndex, this._getRandomTime()],
                readOnly: false
            });
        }
        return workload;
    }

    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {ConnectorBase} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        if(!this.roundArguments.accountPhasePrefix) {
            throw new Error('marketplace.announce - the "accountPhasePrefix" argument is missing');
        }

        if(!this.roundArguments.txnPerBatch) {
            this.roundArguments.txnPerBatch = 1;
        }

        this.accountPrefix = SimpleOpenWorkload._get26Num(workerIndex);
    }

    /**
     * Assemble TXs for opening new accounts.
     */
    async submitTransaction() {
        let args = this._generateWorkload();
        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new SimpleOpenWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
