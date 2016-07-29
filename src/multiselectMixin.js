import { deepClone } from './utils'
import Vue from 'vue'

module.exports = {
  data () {
    return {
      search: '',
      isOpen: false,
      value: [],
      mTouched: this.touched
    }
  },
  props: {
    /**
     * Array of available options: Objects, Strings or Integers.
     * If array of objects, visible label will default to option.label.
     * If `labal` prop is passed, label will equal option['label']
     * @type {Array}
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     * @default false
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Required. Presets the selected options. Add `.sync` to
     * update parent value. If this.onChange callback is present,
     * this will not update. In that case, the parent is responsible
     * for updating this value.
     * @type {Object||Array||String||Integer}
     */
    selected: {
      required: true
    },
    /**
     * Key to compare objects
     * @default 'id'
     * @type {String}
     */
    key: {
      type: String
    },
    /**
     * Label to look for in option Object
     * @default 'label'
     * @type {String}
     */
    label: {
      type: String
    },
    /**
     * Enable/disable search in options
     * @default true
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * Clear the search input after select()
     * @default true
     * @type {Boolean}
     */
    clearOnSelect: {
      type: Boolean,
      default: true
    },
    /**
     * Hide already selected options
     * @default false
     * @type {Boolean}
     */
    hideSelected: {
      type: Boolean,
      default: false
    },
    /**
     * Equivalent to the `placeholder` attribute on a `<select>` input.
     * @default 'Select option'
     * @type {String}
     */
    placeholder: {
      type: String,
      default: 'Select option'
    },
    /**
     * Sets maxHeight style value of the dropdown
     * @default 300
     * @type {Integer}
     */
    maxHeight: {
      type: Number,
      default: 300
    },
    /**
     * Allow to remove all selected values
     * @default true
     * @type {Boolean}
     */
    allowEmpty: {
      type: Boolean,
      default: true
    },
    /**
     * Value that indicates if the dropdown has been used.
     * Useful for validation.
     * @default false
     * @type {Boolean}
     */
    touched: {
      type: Boolean,
      default: false
    },
    /**
     * Reset this.value, this.search, this.selected after this.value changes.
     * Useful if want to create a stateless dropdown, that fires the this.onChange
     * callback function with different params.
     * @default false
     * @type {Boolean}
     */
    resetAfter: {
      type: Boolean,
      default: false
    },
    /**
     * Enable/disable closing after selecting an option
     * @default true
     * @type {Boolean}
     */
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    /**
     * Function to interpolate the custom label
     * @default false
     * @type {Function}
     */
    customLabel: {
      type: Function,
      default: function () {
        return false
      }
    },
    /**
     * Disable / Enable tagging
     * @default false
     * @type {Boolean}
     */
    taggable: {
      type: Boolean,
      default: false
    },
    /**
     * String to show when highlighting a potential tag
     * @default 'Press enter to create a tag'
     * @type {String}
    */
    tagPlaceholder: {
      type: String,
      default: 'Press enter to create a tag'
    },
    /**
     * Number of allowed selected options. No limit if false.
     * @default False
     * @type {Number}
    */
    max: {
      type: Number,
      default: 0
    },
    /**
     * Will be passed with all events as second param.
     * Useful for identifying events origin.
     * @default null
     * @type {String|Integer}
    */
    id: {
      default: null
    }
  },
  created () {
    if (!this.selected) {
      Vue.set(this, 'value', this.multiple ? [] : null)
    } else {
      this.value = deepClone(this.selected)
    }
    if (this.searchable) this.adjustSearch()
  },
  computed: {
    filteredOptions () {
      let search = this.search || ''
      let options = this.hideSelected
        ? this.options.filter(this.isNotSelected)
        : this.options
      // options = this.$options.filters.filterBy(options, this.search)
      // if (search !== '') {
      //   // TODO: Check Functionallity
      //   options = options.filter(function (row) {
      //     return Object.keys(row).some(function (key) {
      //       return String(row[key]).toLowerCase().indexOf(search) > -1
      //     })
      //   })
      // }
      if (this.taggable && search.length && !this.isExistingOption(search)) {
        options.unshift({ isTag: true, label: search })
      }
      return options
    },
    valueKeys () {
      if (this.key) {
        return this.multiple
          ? this.value.map(element => element[this.key])
          : this.value[this.key]
      } else {
        return this.value
      }
    },
    optionKeys () {
      return this.label
        ? this.options.map(element => element[this.label])
        : this.options
    }
  },
  watch: {
    'value' () {
      if (this.resetAfter) {
        Vue.set('value', null)
        Vue.set('search', null)
        Vue.set('selected', null)
      }
      this.adjustSearch()
    },
    'search' () {
      this.$emit('search-change', this.search, this.id)
    },
    'selected' (newVal, oldVal) {
      this.value = deepClone(this.selected)
    }
  },
  methods: {
    /**
     * Finds out if the given query is already present
     * in the available options
     * @param  {String}
     * @returns {Boolean} returns true if element is available
     */
    isExistingOption (query) {
      return !this.options
        ? false
        : this.optionKeys.indexOf(query) > -1
    },
    /**
     * Finds out if the given element is already present
     * in the result value
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is selected
     */
    isSelected (option) {
      /* istanbul ignore else */
      if (!this.value) return false
      const opt = this.key
        ? option[this.key]
        : option

      if (this.multiple) {
        return this.valueKeys.indexOf(opt) > -1
      } else {
        return this.valueKeys === opt
      }
    },
    /**
     * Finds out if the given element is NOT already present
     * in the result value. Negated isSelected method.
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is not selected
     */
    isNotSelected (option) {
      return !this.isSelected(option)
    },
    /**
     * Returns the option[this.label]
     * if option is Object. Otherwise check for option.label.
     * If non is found, return entrie option.
     *
     * @param  {Object||String||Integer} Passed option
     * @returns {Object||String}
     */
    getOptionLabel (option) {
      if (typeof option === 'object' && option !== null) {
        if (this.customLabel) {
          return this.customLabel(option)
        } else {
          if (this.label && option[this.label]) {
            return option[this.label]
          } else if (option.label) {
            return option.label
          }
        }
      } else {
        return option
      }
    },
    /**
     * Add the given option to the list of selected options
     * or sets the option as the selected option.
     * If option is already selected -> remove it from the results.
     *
     * @param  {Object||String||Integer} option to select/deselect
     */
    select (option) {
      if (this.max && this.multiple && this.value.length === this.max) return
      if (option.isTag) {
        this.$emit('tag', option.label, this.id)
        this.search = ''
      } else {
        if (this.multiple) {
          if (!this.isNotSelected(option)) {
            this.removeElement(option)
          } else {
            this.value.push(option)

            this.$emit('select', deepClone(option), this.id)
            this.$emit('update', deepClone(this.value), this.id)
          }
        } else {
          const isSelected = this.isSelected(option)

          /* istanbul ignore else */
          if (isSelected && !this.allowEmpty) return

          this.value = isSelected ? null : option

          this.$emit('select', deepClone(option), this.id)
          this.$emit('update', deepClone(this.value), this.id)
        }

        if (this.closeOnSelect) this.deactivate()
      }
    },
    /**
     * Removes the given option from the selected options.
     * Additionally checks this.allowEmpty prop if option can be removed when
     * it is the last selected option.
     *
     * @param  {type} option description
     * @returns {type}        description
     */
    removeElement (option) {
      /* istanbul ignore else */
      if (!this.allowEmpty && this.value.length <= 1) return

      if (this.multiple && typeof option === 'object') {
        const index = this.valueKeys.indexOf(option[this.key])
        this.value.splice(index, 1)
      } else {
        this.value.$remove(option)
      }
      this.$emit('remove', deepClone(option), this.id)
      this.$emit('update', deepClone(this.value), this.id)
    },
    /**
     * Calls this.removeElement() with the last element
     * from this.value (selected element Array)
     *
     * @fires this#removeElement
     */
    removeLastElement () {
      /* istanbul ignore else */
      if (this.search.length === 0 && Array.isArray(this.value)) {
        this.removeElement(this.value[this.value.length - 1])
      }
    },
    /**
     * Opens the multiselect’s dropdown.
     * Sets this.isOpen to TRUE
     */
    activate () {
      /* istanbul ignore else */
      if (!this.isOpen) {
        this.isOpen = true
        /* istanbul ignore else  */
        if (this.searchable) {
          this.search = ''
          this.$refs.search.focus()
        } else {
          this.$el.focus()
        }
      }
    },
    /**
     * Closes the multiselect’s dropdown.
     * Sets this.isOpen to FALSE
     */
    deactivate () {
      /* istanbul ignore else */
      if (!this.isOpen) return

      this.isOpen = false
      this.mTouched = true
      /* istanbul ignore else  */
      if (this.searchable) {
        this.$refs.search.blur()
        this.adjustSearch()
      } else {
        this.$el.blur()
      }
    },
    /**
     * Adjusts the Search property to equal the correct value
     * depending on the selected value.
     */
    adjustSearch () {
      if (!this.searchable || !this.clearOnSelect) return

      this.search = this.multiple
        ? ''
        : this.getOptionLabel(this.value)
    },
    /**
     * Call this.activate() or this.deactivate()
     * depending on this.isOpen value.
     *
     * @fires this#activate || this#deactivate
     * @property {Boolean} isOpen indicates if dropdown is open
     */
    toggle () {
      this.isOpen
        ? this.deactivate()
        : this.activate()
    }
  }
}
