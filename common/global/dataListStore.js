"use strict";

class DataListStore {

  constructor(totalSize, whereClause, sortBy, sortType, getMaxCount,  getDataFunction){
    this._cache = [];
    this._size = totalSize || 0;
    this._sqlWhereClause = whereClause || " WHERE 1=1 ";
    this._sortBy = sortBy || "RECNO";
    this._sortType = sortType || "DESC";
    this._getMaxCount = getMaxCount || 25;
    this._getDataFunction = getDataFunction;
  };

  getObjectData(/*number*/rowIndex)/*object*/{
    if((rowIndex % this._getMaxCount === 0) && !this._cache[rowIndex]){
      var self = this;

      this._getDataFunction(this._sqlWhereClause, rowIndex + 1,  rowIndex + this._getMaxCount, this._sortBy, this._sortType, function(err, record){
          if(err){
              console.log(err);
          }
          else{
              if (record && record.length > 0){
                for (var i = 0; i < record.length; i++){
                  //console.log(record)
                  self._cache[rowIndex + i] = record[i];
                }
              }
          }
      });
    }
  };

  getObjectAt(/*number*/ index, makeFunctionCall){
    if(index < 0 || index > this._size){
        return undefined;
    }
    if(this._cache[index] === undefined &&  makeFunctionCall){

      this._cache[index] = this.getObjectData(index);
    }
    return this._cache[index];
  };

  setObject(record){
    for (var i = 0; i < this._cache.length; i++) {
        if(this._cache[i].RECNO.value == record.RECNO.value){
          this._cache[i] = record;
          break;
        }
    }
  };

  /**
  * Populates the entire cache with data.
  * Use with Caution! Behaves slowly for large sizes
  * ex. 100,000 rows
  */

  getAll(){
    if(this._cache.length < this._size){
      for(var i = 0; i < this._size; i++){
        this.getObjectAt(i);
      }
    }
    return this._cache.slice();
  };

  getSize(){
    return this._size;
  };

};

module.exports = DataListStore;
