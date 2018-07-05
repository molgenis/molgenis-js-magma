import MagmaScript, { evaluator } from '../../src/MagmaScript'

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

    it('should return id of wrapped entity', () => {
      expect(magmaEntity.value()).to.equal('A')
    })

    it('should use id value when comparing', () => {
      expect(evaluator('$(\'cookie\').value() === 1', entity)).to.equal(true)
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
          '    cookies.push(cookie.attr(\'id\').value()) // results in [\'1\', \'2\', \'3\']\n' +
          '    cookies.push(cookie.attr(\'name\').value()) // results in [\'Chocolate chip\', \'Strawberry cookie\', \'Banana cookie\']\n' +
          '    cookies.push(cookie.attr(\'tastiness\').value()) // results in [\'9/10\', \'10/10\', \'7/10\']\n' +
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
          '   return cookie.attr(\'name\').value()\n' +
          '}).value()'
        expect(evaluator(sampleScript, entity)).to.deep.equal(['Chocolate chip', 'Strawberry', 'Banana'])
      })

      it('should evaluate $(\'gender\').map({\'m\':\'Male\'}).value()', () => {
        expect(evaluator('$(\'gender\').map({\'m\':\'Male\'}).value()', entity)).to.equal('Male')
      })
    })
  })
})
