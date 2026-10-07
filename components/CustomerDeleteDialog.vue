<template>
  <v-dialog :value="value" max-width="420" @input="$emit('input', $event)">
    <v-card class="modal">
      <h2 class="delete-title">{{ $t('Delete') }}</h2>
      <p class="delete-copy">{{ $t('Delete confirmation') }}</p>
      <footer class="modal-actions">
        <button class="button button-outline" type="button" @click="$emit('input', false)">{{ $t('Cancel') }}</button>
        <button class="button button-danger" type="button" @click="$emit('confirm')">{{ $t('Delete') }}</button>
      </footer>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CustomerDeleteDialog',
  props: { value: { type: Boolean, default: false } },
}
</script>
