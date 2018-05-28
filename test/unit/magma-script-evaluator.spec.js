import { evaluator } from '../../src/MagmaScript'
import moment from 'moment'
import { expect } from 'chai'
import MagmaScript from '../../src/MagmaScript'

describe('evaluator', () => {
  describe('string comparison', () => {
    const expression = '$(\'myProp\').value() === "test"'

    it('should eval  "test === "test" as true ', () => {
      const entity = {myProp: 'test'}
      expect(evaluator(expression, entity)).to.equal(true)
    })

    it('should eval "test === "not test" as false ', () => {
      const entity = {myProp: 'not test'}
      expect(evaluator(expression, entity)).to.equal(false)
    })
  })

  describe('isValidJson', () => {
    const expression = '$(\'myProp\').isValidJson().value()'

    it('should return true in case of valid json ("{"foo": 5}")', () => {
      const entity = {myProp: '{"foo": 5}'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false in case of invalid json ("{"foo: 5}"), missing quotes after foo', () => {
      const entity = {myProp: '{"foo: 5}'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('plus', () => {
    it('add property (3) to value (2) should equal 5', () => {
      const expression = '$(\'myProp\').plus(3).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(5)
    })

    it('add property (2) to property (1) should equal 3', () => {
      const expression = '$(\'myProp1\').plus($(\'myProp2\')).value()'
      const entity = {myProp1: 2, myProp2: 1}
      const result = evaluator(expression, entity)
      expect(result).to.equal(3)
    })
  })

  describe('pow', () => {
    it('raising a property (3) to the power of 3 should equal 27', () => {
      const expression = '$(\'myProp\').pow(3).value()'
      const entity = {myProp: 3}
      const result = evaluator(expression, entity)
      expect(result).to.equal(27)
    })
  })

  describe('times', () => {
    it('property (2) times value (3) should equal 6', () => {
      const expression = '$(\'myProp\').times(3).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(6)
    })

    it('property (2) times property (4) should equal 8', () => {
      const expression = '$(\'myProp1\').times($(\'myProp2\')).value()'
      const entity = {myProp1: 2, myProp2: 4}
      const result = evaluator(expression, entity)
      expect(result).to.equal(8)
    })
  })

  describe('div', () => {
    it('property (1) divided by value (1) should equal 0.5', () => {
      const expression = '$(\'myProp\').div(2).value()'
      const entity = {myProp: 1}
      const result = evaluator(expression, entity)
      expect(result).to.equal(0.5)
    })

    it('property (8) divided by property (2) should equal 4', () => {
      const expression = '$(\'myProp1\').div($(\'myProp2\')).value()'
      const entity = {myProp1: 8, myProp2: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(4)
    })
  })

  describe('age', () => {
    const expression = '$("date").age().value()'

    it('should return undefined in case of empty property', () => {
      const entity = {date: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(undefined)
    })

    it('should return the age in years (4) if the property is a valid date', () => {
      const d = new Date()
      const year = d.getFullYear()
      const month = d.getMonth()
      const day = d.getDate()
      const testDate = new Date(year - 4, month, day)
      const entity = {date: testDate}
      const result = evaluator(expression, entity)
      expect(result).to.equal(4)
    })

    it('should return the age in years if the property is a valid date string', () => {
      const date = '2015-01-01'
      const entity = {date: date}
      const actual = evaluator(expression, entity)

      const expected = moment().diff(date, 'years')
      expect(actual).to.equal(expected)
    })
  })

  describe('map', () => {
    it('should map property value (1) to 2 given the mapping 1:2', () => {
      const expression = '$(\'myProp\').map({0:1, 1:2}, 4, 5).value()'
      const entity = {myProp: 1}
      const result = evaluator(expression, entity)
      expect(result).to.equal(2)
    })

    it('should map to a default value 4 if no mapping is defined for the property (3)', () => {
      const expression2 = '$(\'myProp\').map({0:1, 1:2}, 4, 5).value()'
      const entity2 = {myProp: 3}
      const result2 = evaluator(expression2, entity2)
      expect(result2).to.equal(4)
    })

    it('should map to the null value (5) is property is missing', () => {
      const expression2 = '$(\'myProp\').map({0:1, 1:2}, 4, 5).value()'
      const entity2 = {myProp: null}
      const result2 = evaluator(expression2, entity2)
      expect(result2).to.equal(5)
    })

    it('should map to the null value (5) is property is undefined', () => {
      const expression2 = '$(\'myProp\').map({0:1, 1:2}, 4, 5).value()'
      const entity2 = {myProp: null}
      const result2 = evaluator(expression2, entity2)
      expect(result2).to.equal(5)
    })
  })

  describe('group', () => {
    it('should transform value (101) into group (75+), given a set of groups [18, 35, 50, 75]', () => {
      const expression = '$(\'myProp\').group([18, 35, 50, 75]).value()'
      const entity = {myProp: 101}
      const result = evaluator(expression, entity)
      expect(result).to.equal('75+')
    })
  })

  describe('eq', () => {
    it('property value (null) compared to value null returns false', () => {
      const expression = '$(\'myProp\').eq().value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('property value (null) compared to non null value (3) returns false', () => {
      const expression = '$(\'myProp\').eq(3).value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('non null property value ("a") compared to non null value ("b") returns false', () => {
      const expression = '$(\'myProp\').eq("b").value()'
      const entity = {myProp: 'a'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('non null property value ("c") compared to non null value ("c") returns true', () => {
      const expression = '$(\'myProp\').eq("c").value()'
      const entity = {myProp: 'c'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })
  })

  describe('matches', () => {
    it('property value ("123abc456") matched against regex ("abc") should equal true', () => {
      var patt = new RegExp('abc')
      const expression = '$(\'myProp\').matches(' + patt + ').value()'
      const entity = {myProp: '123abc456'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('property value ("123abc456") matched against regex ("efg") should equal false', () => {
      var patt = new RegExp('efg')
      const expression = '$(\'myProp\').matches(' + patt + ').value()'
      const entity = {myProp: '123abc456'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('isNull', () => {
    it('should return true if property value is null', () => {
      const expression = '$(\'myProp\').isNull().value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if property value is not null', () => {
      const expression = '$(\'myProp\').isNull().value()'
      const entity = {myProp: 'not null'}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('not', () => {
    it('should return the negation (true) of the property value (false)', () => {
      const expression = '$(\'myProp\').not().value()'
      const entity = {myProp: false}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })
  })

  describe('or', () => {
    it('should return true if one property value is true and other is not', () => {
      const expression = '$(\'myProp\').or($(\'otherProp\')).value()'
      const entity = {myProp: true, otherProp: false}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return true if one property value is false and the other is true', () => {
      const expression = '$(\'myProp\').or($(\'otherProp\')).value()'
      const entity = {myProp: false, otherProp: true}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return true if both values are true', () => {
      const expression = '$(\'myProp\').or($(\'otherProp\')).value()'
      const entity = {myProp: true, otherProp: true}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if both values are false', () => {
      const expression = '$(\'myProp\').or($(\'otherProp\')).value()'
      const entity = {myProp: false, otherProp: false}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('and', () => {
    it('should return false if one property value is true and other is not', () => {
      const expression = '$(\'myProp\').and($(\'otherProp\')).value()'
      const entity = {myProp: true, otherProp: false}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return false if one property value is false and the other is true', () => {
      const expression = '$(\'myProp\').and($(\'otherProp\')).value()'
      const entity = {myProp: false, otherProp: true}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return true if both values are true', () => {
      const expression = '$(\'myProp\').and($(\'otherProp\')).value()'
      const entity = {myProp: true, otherProp: true}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if both values are false', () => {
      const expression = '$(\'myProp\').and($(\'otherProp\')).value()'
      const entity = {myProp: false, otherProp: false}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('gt', () => {
    it('should return true if the property value (5) is greater than the given value (4)', () => {
      const expression = '$(\'myProp\').gt(4).value()'
      const entity = {myProp: 5}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if the property value (2) is less than the given value (9)', () => {
      const expression = '$(\'myProp\').gt(9).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return false if the property value is null', () => {
      const expression = '$(\'myProp\').gt(9).value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('lt', () => {
    it('should return false if the property value (5) is more then than the given value (4)', () => {
      const expression = '$(\'myProp\').lt(4).value()'
      const entity = {myProp: 5}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return true if the property value (2) is less then than the given value (9)', () => {
      const expression = '$(\'myProp\').lt(9).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if the property value is null', () => {
      const expression = '$(\'myProp\').lt(9).value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('ge (greater then or equals)', () => {
    it('should return true if the property value (5) is greater than the given value (4)', () => {
      const expression = '$(\'myProp\').ge(4).value()'
      const entity = {myProp: 5}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if the property value (2) is less than the given value (9)', () => {
      const expression = '$(\'myProp\').ge(9).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return true if the property value (2) is equal to the given value (2)', () => {
      const expression = '$(\'myProp\').ge(2).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if the property value is null', () => {
      const expression = '$(\'myProp\').ge(9).value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('le (less then or equals)', () => {
    it('should return false if the property value (5) is more then than the given value (4)', () => {
      const expression = '$(\'myProp\').le(4).value()'
      const entity = {myProp: 5}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return true if the property value (2) is less then than the given value (9)', () => {
      const expression = '$(\'myProp\').le(9).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return true if the property value (2) is equal to the given value (2)', () => {
      const expression = '$(\'myProp\').ge(2).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if the property value is null', () => {
      const expression = '$(\'myProp\').le(9).value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })

  describe('le (less then or equals)', () => {
    it('should return false if the property value (5) is more then than the given value (4)', () => {
      const expression = '$(\'myProp\').le(4).value()'
      const entity = {myProp: 5}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })

    it('should return true if the property value (2) is less then than the given value (9)', () => {
      const expression = '$(\'myProp\').le(9).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return true if the property value (2) is equal to the given value (2)', () => {
      const expression = '$(\'myProp\').ge(2).value()'
      const entity = {myProp: 2}
      const result = evaluator(expression, entity)
      expect(result).to.equal(true)
    })

    it('should return false if the property value is null', () => {
      const expression = '$(\'myProp\').le(9).value()'
      const entity = {myProp: null}
      const result = evaluator(expression, entity)
      expect(result).to.equal(false)
    })
  })
})

describe('MagmaScript', () => {
  const chocChip = {'_idValue': 1, 'id': 1, 'name': 'Chocolate chip', 'tastiness': '9/10'}
  const strawberry = {'_idValue': 2, 'id': 2, 'name': 'Strawberry', 'tastiness': '10/10'}
  const banana = {'_idValue': 3, 'id': 3, 'name': 'Banana', 'tastiness': '7/10'}

  const dob = new Date()
  dob.setTime(dob.getTime() - 18 * (365.2425 * 24 * 60 * 60 * 1000))

  const entity = {
    'id': 'A',
    'cookie': chocChip,
    'cookies': [chocChip, strawberry, banana],
    'dob': dob,
    'myStringAttributeName': 'abcde0123',
    'myIntAttributeName': 4,
    'height': 180,
    'name': 'caroline',
    'hasEars': true,
    'male': false,
    'female': true,
    'pregnant': true,
    'data': 1,
    'gender': {'_idValue': 'm', id: 'm', 'label': 'Male'}
  }
  const $ = MagmaScript.$.bind(entity)

  describe('$ function', () => {
    it('should return the attribute value', () => {
      expect($('dob')).to.deep.equal(new MagmaScript(dob))
    })

    it('should work for references', () => {
      expect($('cookie')).to.deep.equal(new MagmaScript(chocChip))
    })

    it('should work for nested attribute of reference', () => {
      expect($('cookie.name')).to.deep.equal(new MagmaScript('Chocolate chip'))
    })

    it('should work for references', () => {
      expect($('cookies')).to.deep.equal(new MagmaScript([chocChip, strawberry, banana]))
    })
  })

  describe('age function', () => {
    const value = new MagmaScript(dob)

    it('should return the correct age', () => {
      expect(value.age()).to.deep.equal(new MagmaScript(18))
    })

    it('should return undefined if value is empty', () => {
      expect(new MagmaScript(null).age()).to.deep.equal(new MagmaScript(undefined))
    })
  })

  describe('times function', () => {
    const value = new MagmaScript(4.5)
    it('should multiply with given value', () => {
      expect(value.times(3)).to.deep.equal(new MagmaScript(3 * 4.5))
    })
  })

  describe('map function', () => {
    const value = new MagmaScript([3, 4])

    it('should wrap mapped elements', () => {
      expect(value.map((x) => x)).to.deep.equal(new MagmaScript([new MagmaScript(3), new MagmaScript(4)]))
    })
  })

  describe('value function', () => {
    const magmaValue = new MagmaScript(1)
    const entityWithIdVal = {entity, '_idValue': 'A'}
    const magmaEntity = new MagmaScript(entityWithIdVal)
    it('should return wrapped value', () => {
      expect(magmaValue.value()).to.equal(1)
    })

    it('should return wrapped entity', () => {
      expect(magmaEntity.value()).to.deep.equal(entityWithIdVal)
    })
  })

  describe('evaluator', () => {
    it('should return idValue for objects', () => {
      expect(evaluator('$(\'cookie\').value()', entity)).to.equal(1)
    })

    describe('when applied to expressions in the reference', () => {
      it('should evaluate $(\'myStringAttributeName\').matches(/^[a-z0-9]+$/i).value()', () => {
        expect(evaluator('$(\'myStringAttributeName\').matches(/^[a-z0-9]+$/i).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'myIntAttributeName\').gt(3).and($(\'myIntAttributeName\').lt(6)).value()', () => {
        expect(evaluator('$(\'myIntAttributeName\').gt(3).and($(\'myIntAttributeName\').lt(6)).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'height\').plus(100)', () => {
        expect(evaluator('$(\'height\').plus(100)', entity)).to.deep.equal(new MagmaScript(280))
      })

      it('should evaluate $(\'height\').pow(100)', () => {
        expect(evaluator('$(\'height\').pow(100)', entity)).to.deep.equal(new MagmaScript(3.367057324275169e+225))
      })

      it('should evaluate $(\'height\').times(100)', () => {
        expect(evaluator('$(\'height\').times(100)', entity)).to.deep.equal(new MagmaScript(18000))
      })

      it('should evaluate $(\'height\').div(100)', () => {
        expect(evaluator('$(\'height\').div(100)', entity)).to.deep.equal(new MagmaScript(1.8))
      })

      it('should evaluate $(\'height\').gt(100).value()', () => {
        expect(evaluator('$(\'height\').gt(100).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'height\').lt(100).value()', () => {
        expect(evaluator('$(\'height\').lt(100).value()', entity)).to.equal(false)
      })

      it('should evaluate $(\'height\').ge(100).value()', () => {
        expect(evaluator('$(\'height\').ge(100).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'height\').le(100).value()', () => {
        expect(evaluator('$(\'height\').le(100).value()', entity)).to.equal(false)
      })

      it('should evaluate $(\'height\').eq(100).value()', () => {
        expect(evaluator('$(\'height\').eq(100).value()', entity)).to.equal(false)
      })

      it('should evaluate $(\'name\').matches(/^[a-z0-9]+$/i).value()', () => {
        expect(evaluator('$(\'name\').matches(/^[a-z0-9]+$/i).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'height\').isNull().value()', () => {
        expect(evaluator('$(\'height\').isNull().value()', entity)).to.equal(false)
      })

      it('should evaluate $(\'hasEars\').not().value()', () => {
        expect(evaluator('$(\'hasEars\').not().value()', entity)).to.equal(false)
      })

      it('should evaluate $(\'male\').or($(\'female\')).value()', () => {
        expect(evaluator('$(\'male\').or($(\'female\')).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'female\').and($(\'pregnant\')).value()', () => {
        expect(evaluator('$(\'female\').and($(\'pregnant\')).value()', entity)).to.equal(true)
      })

      it('should evaluate $(\'height\').unit(\'cm\').value()', () => {
        expect(evaluator('$(\'height\').unit(\'cm\').value()', entity)).to.equal(180)
      })

      it('should evaluate $(\'height\').unit(\'cm\').toUnit(\'m\').value()', () => {
        expect(evaluator('$(\'height\').unit(\'cm\').toUnit(\'m\').value()', entity)).to.equal(1.80)
      })

      it('should evaluate $(\'dob\').age().value()', () => {
        expect(evaluator('$(\'dob\').age().value()', entity)).to.equal(18)
      })

      it('should evaluate $(\'data\').map({0:1, 1:2}).value()', () => {
        expect(evaluator('$(\'data\').map({0:1, 1:2}).value()', entity)).to.equal(2)
      })

      it('should evaluate $(\'dob\').age().group([18, 35, 50, 75]).value()', () => {
        expect(evaluator('$(\'dob\').age().group([18, 35, 50, 75]).value()', entity)).to.equal('18-35')
      })

      it('should evaluate the sample script', () => {
        const sampleScript = 'var cookies = []\n' +
          '$(\'cookies\').map(function (cookie) {\n' +
          '    cookies.push(cookie.value()) // results in [\'1\', \'2\', \'3\']\n' +
          '    cookies.push(cookie.value().id) // results in [\'1\', \'2\', \'3\']\n' +
          '    cookies.push(cookie.value().name) // results in [\'Chocolate chip\', \'Strawberry cookie\', \'Banana cookie\']\n' +
          '    cookies.push(cookie.value().tastiness) // results in [\'9/10\', \'10/10\', \'7/10\']\n' +
          '});\n' +
          'cookies'
        expect(evaluator(sampleScript, entity)).to.deep.equal([1, 1, 'Chocolate chip', '9/10', 2, 2, 'Strawberry', '10/10', 3, 3, 'Banana', '7/10'])
      })

      it('should evaluate a cleaner version of the sample script', () => {
        const sampleScript = '$(\'cookies\').map(function (cookie) {\n' +
          '   return cookie.value()\n' +
          '}).value()'
        expect(evaluator(sampleScript, entity)).to.deep.equal([1, 2, 3])
      })

      it('should evaluate a cleaner version of the sample script', () => {
        const sampleScript = '$(\'cookies\').map(function (cookie) {\n' +
          '   return cookie.value().name\n' +
          '}).value()'
        expect(evaluator(sampleScript, entity)).to.deep.equal(['Chocolate chip', 'Strawberry', 'Banana'])
      })

      it('should evaluate $(\'gender\').map({\'m\':\'Male\'}).value()', () => {
        expect(evaluator('$(\'gender\').map({\'m\':\'Male\'}).value()', entity)).to.equal('Male')
      })
    })
  })
})
