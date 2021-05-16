import { shallowMount } from '@vue/test-utils'
import Multiselect from '@/Multiselect.vue'

describe('Multiselect.vue', () => {
  describe(':value', () => {
    test('should work when initial value is null', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: null,
          options: [{ val: 1, label: '1' }, { val: 2, label: '2' }]
        }
      })

      expect(wrapper.vm.internalValue).toEqual([])
    })
  })
  describe('Events emitting', () => {
    describe('@input', () => {
      test('should be called whenever the value changes passing the new value and id', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: ['3'],
            options: ['1', '2', '3'],
            id: 'id',
            multiple: true
          }
        })

        wrapper.vm.select(wrapper.vm.options[0])
        expect(wrapper.emitted().input).toEqual([[['3', '1'], 'id']])
      })
    })

    describe('@select', () => {
      test('should be called after each select passing the selected option and id', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: null,
            options: ['1', '2', '3'],
            id: 'id'
          }
        })

        wrapper.vm.select(wrapper.vm.options[0])
        expect(wrapper.emitted().select).toEqual([['1', 'id']])
      })
    })

    describe('@remove', () => {
      test('should be called after removing an option, passing the removed option and id', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: ['3'],
            options: ['1', '2', '3'],
            id: 'id'
          }
        })

        wrapper.vm.select(wrapper.vm.options[2])
        expect(wrapper.emitted().remove).toEqual([['3', 'id']])
      })
    })

    describe('@close', () => {
      test('should be called after closing the dropdown with the current value and id', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: ['2'],
            options: ['1', '2', '3'],
            id: 'id'
          }
        })

        wrapper.vm.activate()
        wrapper.vm.deactivate()
        expect(wrapper.emitted().close).toEqual([['2', 'id']])
      })
    })

    describe('@open', () => {
      test('should be called after opening the dropdown passing the id', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: ['2'],
            options: ['1', '2', '3'],
            id: 'id'
          }
        })

        wrapper.vm.activate()
        expect(wrapper.emitted().open).toEqual([['id']])
      })
    })
  })

  describe('Preselecting values', () => {
    describe('when searchable == TRUE', () => {
      describe('when multiple == TRUE', () => {
        test('should preselect passed array of values', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: ['1', '2'],
              options: ['1', '2', '3'],
              multiple: true
            }
          })
          expect(wrapper.vm.internalValue).toEqual(['1', '2'])
          expect(
            wrapper
              .findAll('.multiselect__tag')
              .at(0)
              .text()
          ).toEqual('1')
          expect(
            wrapper
              .findAll('.multiselect__tag')
              .at(1)
              .text()
          ).toEqual('2')
        })

        test('should preselect passed array of objects', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: [{ id: '3' }, { id: '2' }],
              options: [{ id: '1' }, { id: '2' }, { id: '3' }],
              label: 'id',
              trackBy: 'id',
              multiple: true
            }
          })
          expect(wrapper.vm.internalValue).toEqual([{ id: '3' }, { id: '2' }])
          expect(
            wrapper
              .findAll('.multiselect__tag')
              .at(0)
              .text()
          ).toContainEqual('3')
          expect(
            wrapper
              .findAll('.multiselect__tag')
              .at(1)
              .text()
          ).toContainEqual('2')
        })

        test('should preselect passed array of objects if trackBy is a Function', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: [{ id: '2', subid: '1' }, { id: '1', subid: '2' }],
              options: [{ id: '1', subid: '1' }, { id: '1', subid: '2' }, { id: '2', subid: '1' }],
              customLabel: ({id, subid}) => `${id}_${subid}`,
              trackBy: ({id, subid}) => `${id}_${subid}`,
              multiple: true
            }
          })
          expect(wrapper.vm.internalValue).toEqual([{ id: '2', subid: '1' }, { id: '1', subid: '2' }])
          expect(
            wrapper
              .findAll('.multiselect__tag')
              .at(0)
              .text()
          ).toEqual('2_1')
          expect(
            wrapper
              .findAll('.multiselect__tag')
              .at(1)
              .text()
          ).toEqual('1_2')
        })

        test('should set value to [] when passing null as selected', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: null,
              options: [{ id: '1' }, { id: '2' }, { id: '3' }],
              label: 'id',
              trackBy: 'id',
              multiple: true
            }
          })
          expect(wrapper.vm.internalValue).toEqual([])
          expect(wrapper.findAll('.multiselect__tag').length).toEqual(0)
        })
      })

      describe('when multiple == FALSE', () => {
        test('should preselect passed simple value', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: '1',
              options: ['1', '2', '3']
            }
          })
          expect(wrapper.vm.internalValue).toEqual(['1'])
          expect(wrapper.find('.multiselect__single').text()).toEqual(
            '1'
          )
        })

        test('should preselect passed object', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: { id: '2' },
              options: [{ id: '1' }, { id: '2' }, { id: '3' }],
              label: 'id',
              trackBy: 'id'
            }
          })
          expect(wrapper.vm.internalValue).toEqual([{ id: '2' }])
          expect(wrapper.find('.multiselect__single').text()).toEqual(
            '2'
          )
        })

        test('should preselect passed object if trackBy is a Function', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: { id: '1', subid: '2' },
              options: [{ id: '1', subid: '1' }, { id: '1', subid: '2' }, { id: '2', subid: '1' }],
              customLabel: ({id, subid}) => `${id}_${subid}`,
              trackBy: ({id, subid}) => `${id}_${subid}`
            }
          })
          expect(wrapper.vm.internalValue).toEqual([{ id: '1', subid: '2' }])
          expect(wrapper.find('.multiselect__single').text()).toEqual(
            '1_2'
          )
        })
      })
    })
    describe('when searchable == FALSE', () => {
      test('should preselect passed simple value', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: '1',
            options: ['1', '2', '3'],
            searchable: false
          }
        })
        expect(wrapper.vm.internalValue).toEqual(['1'])
        expect(wrapper.find('.multiselect__single').text()).toEqual('1')
      })

      test('should preselect passed object', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: { id: '2' },
            options: [{ id: '1' }, { id: '2' }, { id: '3' }],
            label: 'id',
            trackBy: 'id',
            searchable: false
          }
        })
        expect(wrapper.vm.internalValue).toEqual([{ id: '2' }])
        expect(wrapper.find('.multiselect__single').text()).toEqual('2')
      })
    })
  })

  describe('#select()', () => {
    test('should do nothing when DISABLED == true', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: ['1', '2', '3'],
          multiple: true,
          disabled: true
        }
      })
      wrapper.vm.select(wrapper.vm.options[0])
      expect(wrapper.emitted().input).toEqual(undefined)
    })

    test('should do nothing when selecting a group label', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: 0, $isLabel: true }, '2', '3'],
          multiple: true,
          disabled: true
        }
      })
      wrapper.vm.select(wrapper.vm.options[0])
      expect(wrapper.emitted().input).toBe(undefined)
    })

    test('should reset search input when clearOnSelect == TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: ['1', '2', '3'],
          multiple: true
        }
      })
      wrapper.vm.$refs.search.focus()
      wrapper.vm.search = 'test'
      wrapper.vm.select(wrapper.vm.options[0])
      expect(wrapper.vm.search).toBe('')
    })

    test('should keep search input when clearOnSelect == FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: ['1', '2', '3'],
          multiple: true,
          clearOnSelect: false,
          closeOnSelect: false
        }
      })
      wrapper.vm.$refs.search.focus()
      wrapper.vm.search = 'test'
      wrapper.vm.select(wrapper.vm.options[0])
      expect(wrapper.vm.search).toBe('test')
    })

    describe('when multiple == TRUE', () => {
      test('should add values to selected array', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            multiple: true,
            value: ['1'],
            options: ['1', '2', '3'],
            id: 'id'
          }
        })
        wrapper.vm.select(wrapper.vm.options[1])
        expect(wrapper.emitted().input).toEqual([[['1', '2'], 'id']])
      })

      test('should add objects to selected array', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [{ id: '1' }],
            options: [{ id: '1' }, { id: '2' }, { id: '3' }],
            label: 'id',
            trackBy: 'id',
            multiple: true,
            id: 'id'
          }
        })
        wrapper.vm.select(wrapper.vm.options[1])
        expect(wrapper.emitted().input).toEqual([
          [[{ id: '1' }, { id: '2' }], 'id']
        ])
      })

      test('should remove already selected object', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [{ id: '2' }],
            options: [{ id: '1' }, { id: '2' }, { id: '3' }],
            label: 'id',
            trackBy: 'id',
            multiple: true,
            id: 'id'
          }
        })
        wrapper.vm.select(wrapper.vm.options[1])
        expect(wrapper.emitted().input).toEqual([[[], 'id']])
      })

      test('should NOT remove already selected object when called with Tab key', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [{ id: '2' }],
            options: [{ id: '1' }, { id: '2' }, { id: '3' }],
            label: 'id',
            trackBy: 'id',
            multiple: true,
            id: 'id'
          }
        })
        wrapper.vm.select(wrapper.vm.options[1], 'Tab')
        expect(wrapper.emitted().input).toEqual(undefined)
      })
      describe('and when max == 3', () => {
        test('should prevent from adding more than 3 elements', () => {
          const wrapper = shallowMount(Multiselect, {
            propsData: {
              value: [{ id: '1' }, { id: '2' }, { id: '3' }],
              options: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
              label: 'id',
              trackBy: 'id',
              multiple: true,
              id: 'id',
              max: 3
            }
          })
          wrapper.vm.select(wrapper.vm.options[3])
          expect(wrapper.emitted().input).toEqual(undefined)
        })
      })
    })
    describe('when multiple == FALSE', () => {
      test('should not deselect a value when called with Tab key', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [{ id: '2' }],
            options: [{ id: '1' }, { id: '2' }, { id: '3' }],
            label: 'id',
            trackBy: 'id',
            id: 'id'
          }
        })
        wrapper.vm.select(wrapper.vm.options[1], 'Tab')
        expect(wrapper.emitted().input).toEqual(undefined)
      })
    })
    describe('when closeOnSelect == FALSE', () => {
      test('should not close the dropdown', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [{ id: '2' }],
            options: [{ id: '1' }, { id: '2' }, { id: '3' }],
            label: 'id',
            trackBy: 'id',
            closeOnSelect: false,
            id: 'id'
          }
        })
        wrapper.vm.activate()
        wrapper.vm.select(wrapper.vm.options[0])
        expect(wrapper.vm.isOpen).toEqual(true)
      })
    })
  })
  describe('#selectGroup()', () => {
    test('should do nothing when selecting a group label and groupSelect == FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [
            {
              label: 'Label 1',
              values: [{ name: 'Value 1' }, { name: 'Value 2' }]
            },
            {
              label: 'Label 2',
              values: [{ name: 'Value 3' }, { name: 'Value 4' }]
            }
          ],
          multiple: true,
          groupValues: 'values',
          groupLabel: 'label',
          id: 'id'
        }
      })
      wrapper.vm.select(wrapper.vm.filteredOptions[0])
      expect(wrapper.emitted().input).toEqual(undefined)
    })
    describe('when selecting a group label and groupSelect == TRUE', () => {
      test('should add values to selected array', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [],
            options: [
              { label: 'Label 1', values: ['Value 1', 'Value 2'] },
              { label: 'Label 2', values: ['Value 3', 'Value 4'] }
            ],
            multiple: true,
            groupValues: 'values',
            groupLabel: 'label',
            groupSelect: true
          }
        })
        wrapper.vm.select(wrapper.vm.filteredOptions[0])
        expect(wrapper.emitted().input).toEqual([
          [['Value 1', 'Value 2'], null]
        ])
      })
      test('should add objects to selected array', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [],
            options: [
              {
                label: 'Label 1',
                values: [{ name: 'Value 1' }, { name: 'Value 2' }]
              },
              {
                label: 'Label 2',
                values: [{ name: 'Value 3' }, { name: 'Value 4' }]
              }
            ],
            multiple: true,
            trackBy: 'name',
            groupValues: 'values',
            groupLabel: 'label',
            groupSelect: true
          }
        })
        wrapper.vm.select(wrapper.vm.filteredOptions[0])
        expect(wrapper.emitted().input).toEqual([
          [[{ name: 'Value 1' }, { name: 'Value 2' }], null]
        ])
      })
      test('should remove already selected objects', () => {
        const options = [
          { name: 'Value 1' },
          { name: 'Value 2' },
          { name: 'Value 3' },
          { name: 'Value 4' }
        ]
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [options[0], options[1]],
            options: [
              {
                label: 'Label 1',
                values: [options[0], options[1]]
              },
              {
                label: 'Label 2',
                values: [options[2], options[3]]
              }
            ],
            multiple: true,
            trackBy: 'name',
            groupValues: 'values',
            groupLabel: 'label',
            groupSelect: true
          }
        })
        wrapper.vm.select(wrapper.vm.filteredOptions[0])
        expect(wrapper.emitted().input).toEqual([[[], null]])
      })
      test('should not add duplicate values to selected array', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: ['Value 1'],
            options: [
              { label: 'Label 1', values: ['Value 1', 'Value 2'] },
              { label: 'Label 2', values: ['Value 3', 'Value 4'] }
            ],
            multiple: true,
            groupValues: 'values',
            groupLabel: 'label',
            groupSelect: true
          }
        })
        wrapper.vm.select(wrapper.vm.filteredOptions[0])
        expect(wrapper.emitted().input).toEqual([
          [['Value 1', 'Value 2'], null]
        ])
      })
    })
    describe('when selecting a group label, groupSelect == TRUE and $isDisabled == TRUE', () => {
      test('should add values to selected array except disabled values', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            value: [],
            options: [
              {
                label: 'Label 1',
                values: [
                  { key: 'Value 1', value: 'Value 1' },
                  { key: 'Value 2', value: 'Value 2', $isDisabled: true }
                ]
              },
              {
                label: 'Label 2',
                values: [
                  { key: 'Value 3', value: 'Value 3' },
                  { key: 'Value 4', value: 'Value 4' }
                ]
              }
            ],
            multiple: true,
            groupValues: 'values',
            groupLabel: 'label',
            groupSelect: true
          }
        })
        wrapper.vm.select(wrapper.vm.filteredOptions[0])
        expect(wrapper.emitted().input).toEqual([
          [[{ key: 'Value 1', value: 'Value 1' }], null]
        ])
      })
    })
  })
  describe('#removeElement()', () => {
    test('should not do anything if disabled == TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [{ id: '1' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          multiple: true,
          label: 'id',
          trackBy: 'id',
          disabled: true
        }
      })
      wrapper.vm.removeElement(wrapper.vm.internalValue[0])
      expect(wrapper.emitted().input).toEqual(undefined)
    })

    test('should remove passed element', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [{ id: '1' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          multiple: true,
          label: 'id',
          trackBy: 'id'
        }
      })
      wrapper.vm.removeElement(wrapper.vm.value[0])
      expect(wrapper.emitted().input).toEqual([[[], null]])
    })

    test('should NOT remove passed element when allowEmpty == FALSE & 1 element is left', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [{ id: '1' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          multiple: true,
          label: 'id',
          trackBy: 'id',
          allowEmpty: false
        }
      })
      wrapper.vm.removeElement(wrapper.vm.internalValue[0])
      expect(wrapper.emitted().input).toEqual(undefined)
    })
  })

  describe('#removeLastElement()', () => {
    test('should remove last selected element', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [{ id: '1' }, { id: '2' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.removeLastElement()
      expect(wrapper.emitted().input).toEqual([[[{ id: '1' }], null]])
    })
    test('should not do anything if "Delete" key is blocked', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [{ id: '1' }, { id: '2' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true,
          blockKeys: ['Delete']
        }
      })
      wrapper.vm.removeLastElement()
      expect(wrapper.emitted().input).toEqual(undefined)
    })
  })

  describe('#addPointerElement()', () => {
    test('should select() currently pointed option', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.pointer = 2
      wrapper.vm.addPointerElement()
      expect(wrapper.emitted().input).toEqual([[[{ id: '3' }], null]])
    })
  })

  describe('#pointerForward()', () => {
    test('should increase the pointer value by 2 if next option is label', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2', $isLabel: true }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.pointer = 0
      wrapper.vm.pointerForward()
      expect(wrapper.vm.pointer).toBe(2)
    })

    test('should increase the pointer value by 1', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 1
      wrapper.vm.pointerForward()
      expect(wrapper.vm.pointer).toBe(2)
    })

    test('should NOT increase the pointer value if pointed at last element', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 2
      wrapper.vm.pointerForward()
      expect(wrapper.vm.pointer).toBe(2)
    })
  })

  describe('#pointerBackward()', () => {
    test('should increase the pointer value by 1 if the first option is a label', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1', $isLabel: true }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id'
        }
      })
      wrapper.vm.pointer = 1
      wrapper.vm.pointerBackward()
      expect(wrapper.vm.pointer).toBe(1)
    })
    test('should decrease the pointer value by 2 if previous option is label', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2', $isLabel: true }, { id: '3' }],
          label: 'id',
          trackBy: 'id'
        }
      })
      wrapper.vm.pointer = 2
      wrapper.vm.pointerBackward()
      expect(wrapper.vm.pointer).toBe(0)
    })
    test('should decrease the pointer value by 1', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id'
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 1
      wrapper.vm.pointerBackward()
      expect(wrapper.vm.pointer).toBe(0)
    })

    test('should NOT decrease the pointer value if pointed at first element', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 0
      wrapper.vm.pointerBackward()
      expect(wrapper.vm.pointer).toBe(0)
    })
  })

  describe('#pointerReset()', () => {
    test('should reset the pointer value to 0', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 2
      wrapper.vm.pointerReset()
      expect(wrapper.vm.pointer).toBe(0)
    })
    test('should do nothing when closeOnSelect == FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          trackBy: 'id',
          multiple: true,
          closeOnSelect: false
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 2
      wrapper.vm.pointerReset()
      expect(wrapper.vm.pointer).toBe(2)
    })
  })

  describe('#pointerSet(index)', () => {
    test('should set the pointer value to passed index', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.activate()
      wrapper.vm.pointer = 2
      wrapper.vm.pointerSet(1)
      expect(wrapper.vm.pointer).toBe(1)
    })
  })

  describe('#pointerAdjust()', () => {
    test('should adjust the pointer to stay within options', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.pointer = 5
      wrapper.vm.pointerAdjust()
      expect(wrapper.vm.pointer).toBe(2)
    })
    test('should adjust the pointer to the first non-group-label option after changed from empty', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [],
          label: 'id',
          trackBy: 'id',
          multiple: true,
          groupValues: 'group',
          groupLabel: 'groupLabel'
        }
      })

      wrapper.vm.source = [
        { group: [{ id: '1' }, { id: '2' }], groupLabel: 'A' }
      ]
      setTimeout(function () {
        expect(wrapper.vm.pointer).toBe(1)
      }, 0)
    })
  })

  describe('#watch:value', () => {
    // TODO: Fix this test
    // test('resets value, search and selected when resetAfter is TRUE', () => {
    //   const wrapper = shallowMount(Multiselect, {
    //     propsData: {
    //       options: [{ id: '1' }, { id: '2' }, { id: '3' }],
    //       label: 'id',
    //       trackBy: 'id',
    //       searchable: false,
    //       resetAfter: true
    //     }
    //   })
    //   const comp = wrapper.vm
    //   comp.select(comp.options[2])
    //   expect(wrapper.emitted().input).toEqual([{'id': '3'}, null])
    //   wrapper.update()
    //   expect(wrapper.emitted().input).toEqual([{'id': '3'}, null])
    //   expect(comp.search).toEqual('')
    // })
  })

  describe('#watch:search', () => {
    test('should call @search-change event callback whenever search value changes', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: null,
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          clearOnSelect: false
        }
      })
      wrapper.setData({ search: 'test' })

      expect(wrapper.emitted()['search-change']).toEqual([['test', null]])
    })
  })

  describe('#activate()', () => {
    test('should set isOpen value to true', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.isOpen = false
      wrapper.vm.activate()
      expect(wrapper.vm.isOpen).toBe(true)
    })

    test('should set set the pointer to the first non-group-label option', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: 'id',
          multiple: true,
          groupValues: 'group',
          groupLabel: 'groupLabel',
          value: [],
          options: [
            { group: [{ id: '1' }, { id: '2' }], groupLabel: 'A' },
            { group: [{ id: '3' }, { id: '4' }], groupLabel: 'B' }
          ]
        }
      })
      wrapper.vm.isOpen = false
      wrapper.vm.activate()
      expect(wrapper.vm.pointer).toBe(1)
    })
  })

  describe('#toggle()', () => {
    test('should set isOpen value to FALSE when it is TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: 'id',
          searchable: false,
          value: null,
          options: [{ id: '1' }, { id: '2' }, { id: '3' }]
        }
      })
      wrapper.vm.isOpen = false
      wrapper.vm.toggle()
      expect(wrapper.vm.isOpen).toBe(true)
      wrapper.vm.toggle()
      expect(wrapper.vm.isOpen).toBe(false)
      wrapper.vm.toggle()
      expect(wrapper.vm.isOpen).toBe(true)
    })
  })

  describe('#deactivate()', () => {
    test('should set isOpen value to false', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.isOpen = true
      wrapper.vm.deactivate()
      expect(wrapper.vm.isOpen).toBe(false)
    })

    test('should reset search value when multiple == TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      wrapper.vm.activate()
      wrapper.vm.search = '1'
      expect(wrapper.vm.search).toBe('1')
      wrapper.vm.deactivate()
      expect(wrapper.vm.$refs.search.value).toBe('')
    })
  })

  describe('#isExistingOption()', () => {
    test('should return FALSE when there are no options to look into', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: null,
          options: []
        }
      })
      expect(wrapper.vm.isExistingOption('test')).toBe(false)
    })

    test('should return TRUE only when query has matching option', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: ['2'],
          options: ['1', '2', '3']
        }
      })
      expect(wrapper.vm.isExistingOption('1')).toBe(true)
      expect(wrapper.vm.isExistingOption('4')).toBe(false)
    })
  })

  describe('#isSelected()', () => {
    test('should return TRUE when passed option is selected when multiple == TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: ['1'],
          options: ['1', '2', '3']
        }
      })
      const option = wrapper.vm.options[0]
      expect(wrapper.vm.isSelected(option)).toBe(true)
    })

    test('should return FALSE when passed option is selected when multiple == TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: ['1'],
          options: ['1', '2', '3']
        }
      })
      const option = wrapper.vm.options[1]
      expect(wrapper.vm.isSelected(option)).toBe(false)
    })

    test('should return TRUE when passed option is selected when multiple == FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: '1',
          options: ['1', '2', '3']
        }
      })
      const option = wrapper.vm.options[0]
      expect(wrapper.vm.isSelected(option)).toBe(true)
    })

    test('should return FALSE when passed option is NOT selected when multiple == FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: '2',
          options: ['1', '2', '3']
        }
      })
      const option = wrapper.vm.options[0]
      expect(wrapper.vm.isSelected(option)).toBe(false)
    })
  })

  describe('#getOptionKey()', () => {
    test('should return option if trackBy is undefined', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          options: ['1', '2', '3']
        }
      })
      const option = wrapper.vm.options[1]
      expect(wrapper.vm.getOptionKey(option)).toBe(option)
    })

    test('should return option[trackBy] if trackBy is a String', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          trackBy: 'id'
        }
      })
      const option = wrapper.vm.options[1]
      expect(wrapper.vm.getOptionKey(option)).toBe('2')
    })

    test('should return trackBy(option) if trackBy is a Function', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1', subid: '1' }, { id: '1', subid: '2' }, { id: '2', subid: '1' }],
          label: 'id',
          trackBy: ({id, subid}) => `${id}_${subid}`,
          multiple: true
        }
      })
      const option = wrapper.vm.options[1]
      expect(wrapper.vm.getOptionKey(option)).toBe('1_2')
    })
  })

  describe('#getOptionLabel()', () => {
    test('should return empty string for undefined option', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          options: ['1', '2', '3']
        }
      })
      expect(wrapper.vm.getOptionLabel(undefined)).toBe('')
    })
    test('should return value for passed option when simple value', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: [],
          options: ['1', '2', '3']
        }
      })
      const option = wrapper.vm.options[1]
      expect(wrapper.vm.getOptionLabel(option)).toBe('2')
    })

    test('should return option.label for passed option', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      const option = wrapper.vm.options[1]
      expect(wrapper.vm.getOptionLabel(option)).toBe('2')
    })

    test('should return option’s label when custom label is set', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          multiple: true
        }
      })
      const option = wrapper.vm.options[2]
      expect(wrapper.vm.getOptionLabel(option)).toBe('3')
    })

    test('should return customLabel’s interpolation if set for objects options', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: 'id',
          multiple: true,
          customLabel ({ id }) {
            return `${id}+${id}`
          },
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }]
        }
      })
      const option = wrapper.vm.options[2]
      expect(wrapper.vm.getOptionLabel(option)).toBe('3+3')
    })

    test('should return customLabel’s interpolation if set for primitive options', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          customLabel (option) {
            return `${option}+${option}`
          },
          value: [],
          options: [1, 2, 3]
        }
      })
      const option = wrapper.vm.options[2]
      expect(wrapper.vm.getOptionLabel(option)).toBe('3+3')
    })
  })

  describe('valueKeys', () => {
    test('should return primitive value Array when no :key is provided', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          value: [1, 2],
          options: [1, 2, 3]
        }
      })
      expect(wrapper.vm.valueKeys).toEqual([1, 2])
    })

    test('should return an Array maped from option[key] values when multiple is TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [{ id: '1' }, { id: '2' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          label: 'id',
          trackBy: 'id',
          searchable: true,
          multiple: true
        }
      })
      expect(wrapper.vm.valueKeys).toEqual(['1', '2'])
    })

    test('should return option[key] value when multiple is FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: 'id',
          searchable: true,
          multiple: false,
          value: { id: '2' },
          options: [{ id: '1' }, { id: '2' }, { id: '3' }]
        }
      })
      const comp = wrapper.vm
      expect(comp.valueKeys).toEqual(['2'])
    })

    test('should return trackBy(option) value when multiple is FALSE and trackBy is a Function', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: ({id, subid}) => `${id}_${subid}`,
          searchable: true,
          multiple: false,
          value: { id: '1', subid: '2' },
          options: [{ id: '1', subid: '1' }, { id: '1', subid: '2' }, { id: '2', subid: '1' }]
        }
      })
      const comp = wrapper.vm
      expect(comp.valueKeys).toEqual(['1_2'])
    })
  })

  describe('optionKeys', () => {
    test('should return primitive value Array when no :label is provided', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          searchable: true,
          value: [1, 2],
          options: [1, 2, 3]
        }
      })
      expect(wrapper.vm.optionKeys).toEqual(['1', '2', '3'])
    })

    test('should return an Array maped from option[label] values', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: 'id',
          searchable: true,
          multiple: true,
          value: [{ id: '1' }, { id: '2' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }]
        }
      })
      expect(wrapper.vm.optionKeys).toEqual(['1', '2', '3'])
    })

    test('should return an flat Array maped from option[label] of group values', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'label',
          trackBy: 'id',
          groupValues: 'values',
          groupLabel: 'groupLabel',
          searchable: true,
          multiple: true,
          options: [
            {
              groupLabel: 'group1',
              values: [{ label: 'aa', id: '1' }]
            },
            {
              groupLabel: 'group2',
              values: [{ label: 'bb1', id: '2' }, { label: 'bb2', id: '3' }]
            }
          ]
        }
      })
      expect(wrapper.vm.optionKeys).toEqual(['aa', 'bb1', 'bb2'])
    })

    test('when an option group is empty, return null to prevent formatting a non existent item.', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'label',
          trackBy: 'id',
          groupValues: 'values',
          groupLabel: 'groupLabel',
          searchable: true,
          multiple: true,
          options: [
            {
              groupLabel: 'group1',
              values: [{ label: 'aa', id: '1' }]
            },
            {
              groupLabel: 'group2',
              values: [{ label: 'bb1', id: '2' }, { label: 'bb2', id: '3' }]
            },
            {
              groupLabel: 'group3',
              values: []
            },
            {
              groupLabel: 'group4',
              values: [{ label: 'cc', id: '4' }]
            }
          ]
        }
      })
      expect(wrapper.vm.optionKeys).toEqual(['aa', 'bb1', 'bb2', 'cc'])
    })
  })

  describe('filteredOptions', () => {
    describe('when groupValues is passed', () => {
      test('should return a flat options list', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            groupValues: 'values',
            groupLabel: 'groupLabel',
            searchable: true,
            value: [],
            options: [
              {
                groupLabel: 'GroupX',
                values: ['1', '1x', '1y']
              },
              {
                groupLabel: 'GroupY',
                values: ['2', '2x', '2y']
              }
            ]
          }
        })
        const flatList = [
          { $groupLabel: 'GroupX', $isLabel: true },
          '1',
          '1x',
          '1y',
          { $groupLabel: 'GroupY', $isLabel: true },
          '2',
          '2x',
          '2y'
        ]
        const comp = wrapper.vm
        expect(comp.filteredOptions).toEqual(flatList)
      })
      test('should return a flat options list when options are objects', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            groupValues: 'values',
            groupLabel: 'groupLabel',
            searchable: true,
            trackBy: 'id',
            label: 'label',
            value: [],
            options: [
              {
                groupLabel: 'GroupX',
                values: [{ label: 'aa', id: '1' }]
              },
              {
                groupLabel: 'GroupY',
                values: [{ label: 'bb1', id: '2' }, { label: 'bb2', id: '3' }]
              }
            ]
          }
        })
        const flatList = [
          { $groupLabel: 'GroupX', $isLabel: true },
          { label: 'aa', id: '1' },
          { $groupLabel: 'GroupY', $isLabel: true },
          { label: 'bb1', id: '2' },
          { label: 'bb2', id: '3' }
        ]
        const comp = wrapper.vm
        expect(comp.filteredOptions).toEqual(flatList)
      })
      test('should return a filtered flat options list', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            groupValues: 'values',
            groupLabel: 'groupLabel',
            searchable: true,
            value: [],
            options: [
              {
                groupLabel: 'GroupX',
                values: ['1', '1xYY', '1yXx', '2z']
              },
              {
                groupLabel: 'GroupY',
                values: ['2', '2x', '2yY', '1z']
              }
            ]
          }
        })
        const flatList = [
          { $groupLabel: 'GroupX', $isLabel: true },
          '1xYY',
          { $groupLabel: 'GroupY', $isLabel: true },
          '2yY'
        ]
        const comp = wrapper.vm
        comp.search = 'Yy'
        expect(comp.filteredOptions).toEqual(flatList)
      })
      test('should remove groups without matching results', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            groupValues: 'values',
            groupLabel: 'groupLabel',
            searchable: true,
            value: [],
            options: [
              {
                groupLabel: 'GroupX',
                values: ['1', '1x', '1y']
              },
              {
                groupLabel: 'GroupY',
                values: ['2', '2x', '2y']
              }
            ]
          }
        })
        const flatList = [
          { $groupLabel: 'GroupY', $isLabel: true },
          '2',
          '2x',
          '2y'
        ]
        const comp = wrapper.vm
        comp.search = '2'
        expect(comp.filteredOptions).toEqual(flatList)
      })
      test('should filter options objects matching query', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            groupValues: 'values',
            groupLabel: 'groupLabel',
            searchable: true,
            trackBy: 'value',
            label: 'label',
            value: [],
            options: [
              {
                groupLabel: 'GroupX',
                values: [
                  { value: 1, label: 'One' },
                  { value: 2, label: 'Two' },
                  { value: 3, label: 'Three' }
                ]
              },
              {
                groupLabel: 'GroupY',
                values: [
                  { value: 4, label: 'OneTwo' },
                  { value: 5, label: 'TwoThree' },
                  { value: 6, label: 'ThreeFour' }
                ]
              }
            ]
          }
        })
        const flatList = [
          { $groupLabel: 'GroupX', $isLabel: true },
          { value: 2, label: 'Two' },
          { $groupLabel: 'GroupY', $isLabel: true },
          { value: 4, label: 'OneTwo' },
          { value: 5, label: 'TwoThree' }
        ]
        const comp = wrapper.vm
        comp.search = 'two'
        expect(comp.filteredOptions).toEqual(flatList)
      })
    })
    test('should return matched options according to search value', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          trackBy: 'id',
          searchable: true,
          multiple: true
        }
      })
      const comp = wrapper.vm
      expect(comp.filteredOptions).toEqual([
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ])
      comp.search = '2'
      expect(comp.filteredOptions).toEqual([{ id: '2' }])
    })

    test('should return matched options according to search value', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          trackBy: 'id',
          searchable: true,
          multiple: true
        }
      })
      const comp = wrapper.vm
      expect(comp.filteredOptions).toEqual([
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ])
      comp.search = '2'
      expect(comp.filteredOptions).toEqual([{ id: '2' }])
    })

    test('should return no options when there are no matches with search value', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          value: [],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          trackBy: 'id',
          searchable: true,
          multiple: true
        }
      })
      const comp = wrapper.vm
      expect(comp.filteredOptions).toEqual([
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ])
      comp.search = '4'
      expect(comp.filteredOptions).toEqual([])
    })

    test('should hide already selected elements when :hide-selected is set to true', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'id',
          trackBy: 'id',
          value: [{ id: '2' }],
          options: [{ id: '1' }, { id: '2' }, { id: '3' }],
          searchable: true,
          hideSelected: true,
          multiple: true
        }
      })
      expect(wrapper.vm.filteredOptions).toEqual([{ id: '1' }, { id: '3' }])
    })

    test('should add additional option at the begining when search is filled and :taggable is TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          multiple: true,
          taggable: true,
          value: [],
          options: [10, 20, 30]
        }
      })
      expect(wrapper.vm.filteredOptions).toEqual([10, 20, 30])
      expect(wrapper.vm.filteredOptions.length).toBe(3)
      wrapper.vm.search = 'test'
      expect(wrapper.vm.filteredOptions).toEqual([
        { isTag: true, label: 'test' }
      ])
      expect(wrapper.vm.filteredOptions.length).toBe(1)
      wrapper.vm.search = '1'
      expect(wrapper.vm.filteredOptions).toEqual([
        { isTag: true, label: '1' },
        10
      ])
      expect(wrapper.vm.filteredOptions.length).toBe(2)
    })

    test('should not alter the available options when :internal-search is FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          internalSearch: false,
          value: [],
          options: [10, 20, 30]
        }
      })
      const comp = wrapper.vm
      expect(comp.filteredOptions).toEqual([10, 20, 30])
      expect(comp.filteredOptions.length).toBe(3)
      comp.search = 'test'
      expect(comp.filteredOptions).toEqual([10, 20, 30])
      expect(comp.filteredOptions.length).toBe(3)
    })

    test('should return only as many options as set in the :options-limit prop.', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          multiple: true,
          optionsLimit: 2,
          value: [],
          options: ['test', 'production', 'testing']
        }
      })
      expect(wrapper.vm.filteredOptions).toEqual(['test', 'production'])
      expect(wrapper.vm.filteredOptions.length).toBe(2)
      wrapper.vm.search = 'test'
      expect(wrapper.vm.filteredOptions).toEqual(['test', 'testing'])
      expect(wrapper.vm.filteredOptions.length).toBe(2)
    })

    test('should return all the passed options including falsy options', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: [],
          options: ['start', undefined, 0, false, null, 'end']
        }
      })
      expect(wrapper.vm.filteredOptions).toEqual([
        'start',
        undefined,
        0,
        false,
        null,
        'end'
      ])
      expect(wrapper.vm.filteredOptions.length).toBe(6)
    })
  })

  describe('currentOptionLabel', () => {
    test('should return the current option label', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: false,
          multiple: false,
          value: 0,
          options: [0, '1', '2', '3', '4', '5']
        }
      })
      expect(wrapper.vm.currentOptionLabel).toBe(0)
    })
    test('should display selected value even when is the number zero', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          value: 0,
          options: [0, 1, 2, 3, 4, 5]
        }
      })

      expect(wrapper.vm.isSingleLabelVisible).toBe(true)
      expect(wrapper.find('.multiselect__single').text()).toContainEqual(
        '0'
      )
    })
    describe('when MULTIPLE is FALSE', () => {
      test('should return the current option label', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            searchable: false,
            multiple: false,
            value: '3',
            options: ['1', '2', '3', '4', '5']
          }
        })
        expect(wrapper.vm.currentOptionLabel).toBe('3')
      })
    })
    describe('when MULTIPLE is TRUE', () => {
      test('should return the placeholder value', () => {
        const wrapper = shallowMount(Multiselect, {
          propsData: {
            searchable: false,
            multiple: true,
            placeholder: 'Select',
            value: ['1'],
            options: ['1', '2', '3', '4', '5']
          }
        })
        expect(wrapper.vm.currentOptionLabel).toBe('Select')
      })
    })
  })

  describe('#onTag', () => {
    test('should should push to value and options with default settings and :taggable is TRUE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          multiple: true,
          taggable: true,
          value: ['1'],
          options: ['1', '2', '3']
        }
      })
      wrapper.vm.search = 'TEST'
      wrapper.vm.select(wrapper.vm.filteredOptions[0])
      expect(wrapper.emitted().tag).toEqual([['TEST', null]])
    })
  })

  describe('#onTagPosition', () => {
    test("should display new tag above search results by default when tag-position is defaulted to 'top'", () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'name',
          trackBy: 'name',
          searchable: true,
          taggable: true,
          value: [],
          options: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }]
        }
      })
      const comp = wrapper.vm

      expect(comp.filteredOptions).toEqual([
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' }
      ])
      comp.search = 'Ban'
      expect(comp.filteredOptions).toEqual([
        { isTag: true, label: 'Ban' },
        { name: 'Banana' }
      ])
    })

    test("should display new tag below search results when tag-position is set to 'bottom'", () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          label: 'name',
          trackBy: 'name',
          searchable: true,
          taggable: true,
          tagPosition: 'bottom',
          value: [],
          options: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }]
        }
      })
      const comp = wrapper.vm
      expect(comp.filteredOptions).toEqual([
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' }
      ])
      comp.search = 'Ban'
      expect(comp.filteredOptions).toEqual([
        { name: 'Banana' },
        { isTag: true, label: 'Ban' }
      ])
    })
  })

  describe('#limitText', () => {
    test('should by default interpolate the limit text', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          multiple: true,
          limit: 2,
          value: ['1', '2', '3'],
          options: ['1', '2', '3', '4', '5']
        }
      })
      wrapper.vm.limitText(20)
      expect(wrapper.vm.limitText(20)).toBe('and 20 more')
    })
  })

  describe('visibleValues', () => {
    test('should by default interpolate the limit text', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          multiple: true,
          limit: 1,
          value: ['1', '2', '3'],
          options: ['1', '2', '3', '4', '5']
        }
      })
      expect(wrapper.vm.internalValue.length).toBe(3)
      expect(wrapper.vm.visibleValues.length).toBe(1)
    })
  })

  describe('@ready:showLabels', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', '<app></app>')
    })
    test('should hide all labels if :show-labels is FALSE', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          multiple: true,
          limit: 1,
          showLabels: false,
          value: ['1', '2', '3'],
          options: ['1', '2', '3', '4', '5']
        }
      })
      expect(wrapper.vm.selectLabelText).toBe('')
      expect(wrapper.vm.deselectLabelText).toBe('')
      expect(wrapper.vm.selectedLabelText).toBe('')
    })
  })
  describe('#updateSearch', () => {
    test('should update the search value', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          value: ['1', '2', '3'],
          options: ['1', '2', '3', '4', '5']
        }
      })
      expect(wrapper.vm.search).toBe('')
      wrapper.vm.updateSearch('test')
      expect(wrapper.vm.search).toBe('test')
    })
  })
  describe('preselectFirst', () => {
    test('should update the search value', () => {
      const wrapper = shallowMount(Multiselect, {
        propsData: {
          searchable: true,
          value: [],
          options: ['1', '2', '3', '4', '5'],
          preselectFirst: true
        }
      })
      expect(wrapper.emitted().input).toEqual([['1', null]])
    })
  })
})
