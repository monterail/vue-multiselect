/**
 * Adds some functionality to allow the list to be always fully visible
 * @version 0.0.1
 */

/**
 * Calculates the position of the drop-down list relative to the input.
 */
function calculateListPosition (node, vue) {
  let dimensions = node.getBoundingClientRect()
  vue.listStyleTop = dimensions.bottom
  vue.listStyleLeft = dimensions.left
  vue.listStyleWidth = dimensions.width
}

export default {
  data () {
    return {
      listStyleTop: 0,
      listStyleLeft: 0,
      listStyleWidth: 0
    }
  },
  props: {
      /**
       * TODO: add description
       * @default HTMLBodyElement
       * @type {Element}
      */
    positionWrapper: {
      default: () => document.body,
      validator: (node) => node instanceof Element // eslint-disable-line no-undef
    },
    /**
     * Defines how the list will be positioned,
     * should be changed to fixed when its wrapped within another fixed element
     * @default 'absolute'
     * @type {'absolute' | 'fixed'}
     */
    positionStrategy: {
      type: String,
      default: 'absolute',
      validator: (value) => value === 'absolute' || value === 'fixed'
    }
  },
  watch: {
    value () {
      this.$nextTick(calculateListPosition.bind(this, this.$refs.tags, this))
    },
    isOpen () {
      this.$nextTick(calculateListPosition.bind(this, this.$refs.tags, this))
    }
  },
  mounted () {
    this.positionWrapper.appendChild(this.$refs.list)
    window.addEventListener(
      'resize',
      calculateListPosition.bind(this, this.$refs.tags, this),
      {passive: true, capture: true}
    )
    calculateListPosition(this.$refs.tags, this)
  },
  computed: {
    listStyle () {
      return {
        maxHeight: this.optimizedHeight,
        position: this.positionStrategy,
        top: this.positionStrategy === 'fixed' ? this.listStyleTop + 'px' : window.scrollY + this.listStyleTop + 'px',
        left: this.positionStrategy === 'fixed' ? this.listStyleLeft + 'px' : window.scrollX + this.listStyleLeft + 'px',
        width: this.listStyleWidth + 'px'
      }
    }
  }
}
