/**
 * SelectionGrid - Grid de SelectionCards com animação stagger
 *
 * Features:
 * - Layout automático (1 ou 2 colunas)
 * - Animação stagger na entrada
 * - Seleção única ou múltipla
 * - Callback tipado para mudanças
 *
 * @example
 * <SelectionGrid
 *   items={stageOptions}
 *   selectedIds={[selectedStage]}
 *   onSelect={(id) => setSelectedStage(id)}
 *   columns={2}
 *   variant="compact"
 * />
 */

import React, { useCallback } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SelectionCard, SelectionCardVariant } from "./SelectionCard";
import { Tokens } from "@/theme/tokens";
import type { Ionicons } from "@expo/vector-icons";

// ===========================================
// TYPES
// ===========================================

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export interface SelectionGridItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Icon name from Ionicons */
  icon?: IoniconName;
  /** Emoji alternative to icon */
  emoji?: string;
  /** Whether item is disabled */
  disabled?: boolean;
}

export interface SelectionGridProps<T extends string = string> {
  /** Items to display */
  items: SelectionGridItem[];
  /** Currently selected item IDs */
  selectedIds: T[];
  /** Callback when item is selected */
  onSelect: (id: T) => void;
  /** Number of columns (1 or 2) */
  columns?: 1 | 2;
  /** Card variant */
  variant?: SelectionCardVariant;
  /** Allow multiple selections */
  multiSelect?: boolean;
  /** Maximum selections allowed (for multiSelect) */
  maxSelections?: number;
  /** Base delay for stagger animation (ms) */
  staggerDelay?: number;
  /** Additional style */
  style?: ViewStyle;
  /** Test ID prefix for e2e testing */
  testID?: string;
}

// ===========================================
// COMPONENT
// ===========================================

export function SelectionGrid<T extends string = string>({
  items,
  selectedIds,
  onSelect,
  columns = 1,
  variant = "large",
  multiSelect = false,
  maxSelections = 3,
  staggerDelay = Tokens.micro.staggerDelay,
  style,
  testID,
}: SelectionGridProps<T>) {
  const handleSelect = useCallback(
    (id: T) => {
      if (multiSelect) {
        const isSelected = selectedIds.includes(id);
        if (!isSelected && selectedIds.length >= maxSelections) {
          // Max reached, do nothing (or could show feedback)
          return;
        }
      }
      onSelect(id);
    },
    [multiSelect, selectedIds, maxSelections, onSelect]
  );

  // Split items into rows for 2-column layout
  const rows = columns === 2 ? chunkArray(items, 2) : items.map((item) => [item]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {rows.map((rowItems, rowIndex) => (
        <View key={rowIndex} style={[styles.row, columns === 2 && styles.rowTwoColumns]}>
          {rowItems.map((item, colIndex) => {
            const index = rowIndex * columns + colIndex;
            const isSelected = selectedIds.includes(item.id as T);

            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(index * staggerDelay)
                  .duration(400)
                  .springify()}
                style={columns === 2 ? styles.itemHalf : styles.itemFull}
              >
                <SelectionCard
                  selected={isSelected}
                  onPress={() => handleSelect(item.id as T)}
                  icon={item.icon}
                  emoji={item.emoji}
                  label={item.label}
                  subtitle={item.subtitle}
                  variant={variant}
                  disabled={item.disabled}
                  testID={testID ? `${testID}-${item.id}` : undefined}
                />
              </Animated.View>
            );
          })}

          {/* Empty cell for odd items in 2-column layout */}
          {columns === 2 && rowItems.length === 1 && <View style={styles.itemHalf} />}
        </View>
      ))}
    </View>
  );
}

// ===========================================
// HELPERS
// ===========================================

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    gap: Tokens.spacing.md,
  },
  row: {
    flexDirection: "row",
  },
  rowTwoColumns: {
    gap: Tokens.spacing.md,
  },
  itemFull: {
    flex: 1,
  },
  itemHalf: {
    flex: 1,
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default SelectionGrid;
